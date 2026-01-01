from fastapi import APIRouter, Depends
from api.v1.users.schemas import UserResponse
from db.mongo import db
from core.dependencies import get_current_user
from utils.rbac import require_admin
from utils.serializers import serialize_mongo_doc

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserResponse], dependencies=[Depends(require_admin)])
async def get_users(
    user=Depends(get_current_user),
    limit: int = 50,
    skip: int = 0
):
    query = {} if user["role"] == "admin" else {"email": user["email"]}

    users = await db.users.find(query).skip(skip).limit(limit).to_list(limit)

    return [
        UserResponse(
            id=str(u["_id"]),
            email=u["email"],
            role=u["role"]
        )
        for u in users
    ]



