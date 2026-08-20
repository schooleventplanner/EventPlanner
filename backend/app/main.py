from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import database

from app.routes.auth import router as auth_router
from app.routes.events import router as events_router
from app.routes.registrations import router as registrations_router
from app.routes.announcements import router as announcements_router
from app.routes.results import router as results_router


app = FastAPI(
    title="School Event Planner API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://school-event-planner-bice.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(events_router)
app.include_router(registrations_router)
app.include_router(announcements_router)
app.include_router(results_router)


@app.get("/")
def root():
    return {
        "message": "School Event Planner API is running"
    }


@app.get("/test-db")
def test_db():
    database.command("ping")

    return {
        "message": "MongoDB connected"
    }