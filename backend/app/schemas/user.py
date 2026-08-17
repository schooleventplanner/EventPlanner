from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: str
    password: str = Field(min_length=6, max_length=100)
    student_id: str = Field(min_length=1, max_length=30)
    class_name: str = Field(min_length=1, max_length=30)
    phone: str = Field(min_length=5, max_length=20)


class LoginRequest(BaseModel):
    email: str
    password: str