from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId

from app.core.database import database
from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.schemas.user import (
    LoginRequest,
    RegisterRequest,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

users = database["users"]


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
def register(data: RegisterRequest):
    email = data.email.lower().strip()

    if users.find_one({"email": email}):
        raise HTTPException(
            status_code=409,
            detail="Email sudah terdaftar.",
        )

    user = {
        "name": data.name,
        "email": email,
        "password_hash": hash_password(data.password),
        "role": "participant",
        "student_id": data.student_id,
        "class_name": data.class_name,
        "phone": data.phone,
        "is_active": True,
    }

    result = users.insert_one(user)

    return {
        "message": "Registrasi berhasil.",
        "user_id": str(result.inserted_id),
    }


@router.post("/login")
def login(data: LoginRequest):
    email = data.email.lower().strip()

    user = users.find_one({"email": email})

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah.",
        )

    if not verify_password(
        data.password,
        user["password_hash"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah.",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=403,
            detail="Akun tidak aktif.",
        )

    token = create_access_token(
        str(user["_id"])
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        },
    }

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "student_id": current_user.get("student_id"),
        "class_name": current_user.get("class_name"),
        "phone": current_user.get("phone"),
    }