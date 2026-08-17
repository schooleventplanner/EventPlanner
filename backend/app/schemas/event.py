from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=1, max_length=1000)

    category: str = Field(
        pattern="^(individual|team)$"
    )

    date: str
    start_time: str
    end_time: str

    location: str = Field(
        min_length=2,
        max_length=150,
    )

    max_participants: int = Field(
        gt=0,
        le=1000,
    )


class EventUpdate(EventCreate):
    pass


class EventResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    date: str
    start_time: str
    end_time: str
    location: str
    max_participants: int
    registration_open: bool
    status: str