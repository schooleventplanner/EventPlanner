from pydantic import BaseModel, Field


class ResultCreate(BaseModel):
    event_id: str
    winner: str = Field(min_length=2, max_length=100)
    position: int = Field(gt=0, le=10)
    description: str = Field(
        default="",
        max_length=500,
    )


class ResultResponse(BaseModel):
    id: str
    event_id: str
    winner: str
    position: int
    description: str