from pydantic import BaseModel


class RegistrationResponse(BaseModel):
    id: str
    event_id: str
    participant_id: str
    status: str