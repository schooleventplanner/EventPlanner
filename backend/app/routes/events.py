from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import database
from app.core.dependencies import require_staff
from app.schemas.event import (
    EventCreate,
    EventResponse,
    EventUpdate,
)


router = APIRouter(
    prefix="/events",
    tags=["Events"],
)

events = database["events"]


def format_event(event):
    return {
        "id": str(event["_id"]),
        "name": event["name"],
        "description": event["description"],
        "category": event["category"],
        "date": event["date"],
        "start_time": event["start_time"],
        "end_time": event["end_time"],
        "location": event["location"],
        "max_participants": event["max_participants"],
        "registration_open": event["registration_open"],
        "status": event["status"],
    }


@router.get(
    "",
    response_model=list[EventResponse],
)
def get_events():
    event_list = events.find().sort("date", 1)

    return [
        format_event(event)
        for event in event_list
    ]


@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def get_event(event_id: str):
    try:
        event = events.find_one(
            {"_id": ObjectId(event_id)}
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID event tidak valid.",
        )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event tidak ditemukan.",
        )

    return format_event(event)


@router.post(
    "",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    data: EventCreate,
    current_user=Depends(require_staff),
):
    event = {
        **data.model_dump(),
        "registration_open": True,
        "status": "upcoming",
    }

    result = events.insert_one(event)

    event["_id"] = result.inserted_id

    return format_event(event)


@router.put(
    "/{event_id}",
    response_model=EventResponse,
)
def update_event(
    event_id: str,
    data: EventUpdate,
    current_user=Depends(require_staff),
):
    try:
        object_id = ObjectId(event_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID event tidak valid.",
        )

    result = events.update_one(
        {"_id": object_id},
        {
            "$set": data.model_dump()
        },
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Event tidak ditemukan.",
        )

    event = events.find_one(
        {"_id": object_id}
    )

    return format_event(event)


@router.delete("/{event_id}")
def delete_event(
    event_id: str,
    current_user=Depends(require_staff),
):
    try:
        object_id = ObjectId(event_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID event tidak valid.",
        )

    result = events.delete_one(
        {"_id": object_id}
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Event tidak ditemukan.",
        )

    return {
        "message": "Event berhasil dihapus."
    }