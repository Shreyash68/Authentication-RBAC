from fastapi import APIRouter
from api.v1.auth.router import router as auth_router
from api.v1.tasks.router import router as task_router
from api.v1.users.router import router as user_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(task_router)
router.include_router(user_router)
