from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import database
from app.core.dependencies import get_current_user
from app.schemas.registration import RegistrationResponse


router = APIRouter(
    prefix="/registrations",
    tags=["Registrations"],
)

registrations = database["registrations"]
events = database["events"]


@router.post(
    "/{event_id}",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_event(
    event_id: str,
    current_user=Depends(get_current_user),
):
    if current_user.get("role") != "participant":
        raise HTTPException(
            status_code=403,
            detail="Hanya peserta yang dapat mendaftar.",
        )

    try:
        event_object_id = ObjectId(event_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID event tidak valid.",
        )

    event = events.find_one(
        {"_id": event_object_id}
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event tidak ditemukan.",
        )

    if not event.get("registration_open", True):
        raise HTTPException(
            status_code=400,
            detail="Pendaftaran event sudah ditutup.",
        )

    participant_id = current_user["_id"]

    existing = registrations.find_one(
        {
            "event_id": event_object_id,
            "participant_id": participant_id,
        }
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Kamu sudah terdaftar di event ini.",
        )

    registration = {
        "event_id": event_object_id,
        "participant_id": participant_id,
        "status": "pending",
    }

    result = registrations.insert_one(
        registration
    )

    return {
        "id": str(result.inserted_id),
        "event_id": str(event_object_id),
        "participant_id": str(participant_id),
        "status": "pending",
    }


@router.get(
    "/me",
    response_model=list[RegistrationResponse],
)
def get_my_registrations(
    current_user=Depends(get_current_user),
):
    if current_user.get("role") != "participant":
        raise HTTPException(
            status_code=403,
            detail="Hanya peserta yang dapat melihat pendaftaran.",
        )

    participant_id = current_user["_id"]

    data = registrations.find(
        {
            "participant_id": participant_id,
        }
    )

    return [
        {
            "id": str(item["_id"]),
            "event_id": str(item["event_id"]),
            "participant_id": str(
                item["participant_id"]
            ),
            "status": item["status"],
        }
        for item in data
    ]