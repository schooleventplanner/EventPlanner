from bson import ObjectId
from fastapi import APIRouter, HTTPException, status

from app.core.database import database
from app.schemas.result import (
    ResultCreate,
    ResultResponse,
)


router = APIRouter(
    prefix="/results",
    tags=["Results"],
)

results = database["results"]
events = database["events"]


def format_result(item):
    return {
        "id": str(item["_id"]),
        "event_id": str(item["event_id"]),
        "winner": item["winner"],
        "position": item["position"],
        "description": item["description"],
    }


@router.get(
    "",
    response_model=list[ResultResponse],
)
def get_results():
    data = results.find().sort(
        "position",
        1,
    )

    return [
        format_result(item)
        for item in data
    ]


@router.post(
    "",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_result(data: ResultCreate):
    try:
        event_id = ObjectId(data.event_id)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="ID event tidak valid.",
        )

    event = events.find_one(
        {"_id": event_id}
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event tidak ditemukan.",
        )

    result = {
        "event_id": event_id,
        "winner": data.winner,
        "position": data.position,
        "description": data.description,
    }

    inserted = results.insert_one(result)

    result["_id"] = inserted.inserted_id

    return format_result(result)