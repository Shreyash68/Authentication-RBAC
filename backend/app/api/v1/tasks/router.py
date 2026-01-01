from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
import uuid

from api.v1.tasks.schemas import TaskCreate, TaskUpdate, TaskResponse
from db.mongo import db
from core.dependencies import get_current_user
from utils.rbac import require_admin
from utils.serializers import serialize_mongo_doc

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", dependencies=[Depends(require_admin)])
async def create_task(task: TaskCreate, admin=Depends(get_current_user)):
    # 🔐 Business rule: admin cannot assign task to themselves
    if task.assigned_to == admin["email"]:
        raise HTTPException(
            status_code=400,
            detail="Admin cannot assign a task to themselves"
        )

    # Create task data (status already defaulted by Pydantic)
    data = {
        **task.dict(exclude_none=True),
        "created_by": admin["email"]
    }

    # Insert task
    result = await db.tasks.insert_one(data)
    data["_id"] = result.inserted_id

    return {
        "id": str(data["_id"]),
        "created_by": admin["email"],
        **task.dict()
    }



@router.get("/", response_model=list[TaskResponse])
async def get_tasks(user=Depends(get_current_user)):
    query = {} if user["role"] == "admin" else {"assigned_to": user["email"]}

    tasks = await db.tasks.find(query).to_list(100)

    return [
        TaskResponse(
            id=str(task["_id"]),
            title=task["title"],
            priority=task.get("priority"),
            status=task["status"],
            description=task.get("description"),
            assigned_to=str(task["assigned_to"]),
            created_by=str(task["created_by"])
        )
        for task in tasks
    ]


@router.patch("/{task_id}")
async def update_task(
    task_id: str,
    update: TaskUpdate,
    user=Depends(get_current_user)
):
    # 1️⃣ Find task
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # 2️⃣ Authorization (admin OR assigned user)
    if user["role"] != "admin" and task["assigned_to"] != user["email"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    update_data = update.dict(exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    # 3️⃣ Field-level permission
    if user["role"] != "admin":
        # Users can ONLY update status
        if set(update_data.keys()) != {"status"}:
            raise HTTPException(
                status_code=403,
                detail="Users can only update task status"
            )
    else:
        # 🔐 Admin-specific rule: cannot assign to self
        if "assigned_to" in update_data:
            if update_data["assigned_to"] == user["email"]:
                raise HTTPException(
                    status_code=400,
                    detail="Admin cannot assign a task to themselves"
                )

    # 4️⃣ Update task
    await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": update_data}
    )

    return {"message": "Task updated successfully"}




@router.delete(
    "/{task_id}",
    dependencies=[Depends(require_admin)]
)
async def delete_task(task_id: str):
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await db.tasks.delete_one({"_id": ObjectId(task_id)})

    return {"message": "Task deleted successfully"}
