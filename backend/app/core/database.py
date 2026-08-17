import os

from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "school_event_planner",
)

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI belum diset di file .env"
    )

client = MongoClient(MONGODB_URI)

database = client[DATABASE_NAME]