from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import database
from app.core.security import decode_access_token


security = HTTPBearer()

users = database["users"]


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    try:
        user_id = decode_access_token(
            credentials.credentials
        )

        user = users.find_one(
            {"_id": ObjectId(user_id)}
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid.",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan.",
        )

    return user

def require_staff(current_user=Depends(get_current_user)):
    if current_user.get("role") not in ["committee", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses hanya untuk panitia atau admin.",
        )

    return current_user