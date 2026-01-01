from fastapi import APIRouter, HTTPException, Response, Depends
from datetime import timedelta
import uuid

from api.v1.auth.schemas import RegisterSchema, LoginSchema, UserMeResponse
from db.mongo import db
from core.security import hash_password, verify_password, create_access_token
from core.config import ACCESS_TOKEN_EXPIRE_MINUTES
from core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
async def register(data: RegisterSchema):
    if await db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "email": data.email,
        "password": hash_password(data.password),
        "role": data.role
    }
    await db.users.insert_one(user)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(data: LoginSchema, response: Response):
    user = await db.users.find_one({"email": data.email})
    print(db)
    if not user:
        raise HTTPException(status_code=401, detail="User not found With this email")
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = create_access_token(
        {"sub": str(user["_id"]), "role": user["role"]},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax"
    )

    return {"message": "Login successful"}

@router.get("/me", response_model=UserMeResponse)
async def me(current_user = Depends(get_current_user)):
    print(type(current_user))

    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "role": current_user["role"],
    }


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}
