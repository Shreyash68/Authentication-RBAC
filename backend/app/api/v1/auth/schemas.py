from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    role: str  # admin | user

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserMeResponse(BaseModel):
    id: str
    email: str
    role: str
