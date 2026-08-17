from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from app.core.database import database
from app.schemas.announcement import (
    AnnouncementCreate,
    AnnouncementResponse,
)


router = APIRouter(
    prefix="/announcements",
    tags=["Announcements"],
)

announcements = database["announcements"]


def format_announcement(item):
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "content": item["content"],
        "created_at": item["created_at"].isoformat(),
    }


@router.get(
    "",
    response_model=list[AnnouncementResponse],
)
def get_announcements():
    data = announcements.find().sort(
        "created_at",
        -1,
    )

    return [
        format_announcement(item)
        for item in data
    ]


@router.post(
    "",
    response_model=AnnouncementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_announcement(
    data: AnnouncementCreate,
):
    announcement = {
        **data.model_dump(),
        "created_at": datetime.now(timezone.utc),
    }

    result = announcements.insert_one(
        announcement
    )

    announcement["_id"] = result.inserted_id

    return format_announcement(announcement)