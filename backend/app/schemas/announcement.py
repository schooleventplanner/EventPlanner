from pydantic import BaseModel, Field


class AnnouncementCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    content: str = Field(min_length=1, max_length=2000)


class AnnouncementResponse(BaseModel):
    id: str
    title: str
    content: str
    created_at: str 