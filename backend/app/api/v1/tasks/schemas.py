from pydantic import BaseModel
from enum import Enum
from typing import Optional



class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class TaskCreate(BaseModel):
    title: str
    priority: str
    status: TaskStatus = TaskStatus.todo
    description: Optional[str] = None
    assigned_to: str

from pydantic import BaseModel
from typing import Optional

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None 


class TaskResponse(BaseModel):
    id: str
    title: str
    priority: str
    status: TaskStatus
    description: Optional[str]
    assigned_to: str
    created_by: str