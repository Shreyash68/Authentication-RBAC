from pydantic import BaseModel, EmailStr
from typing import Literal

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    role: Literal["admin", "user"]  

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserMeResponse(BaseModel):
    id: str
    email: str
    role: str
