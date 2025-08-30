from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from database import engine
from models import Base
from routers import users, posts, auth

# Ensure DB tables are created on app startup (avoids import-time errors)
def _create_tables_on_startup():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        logging.exception("Database not reachable during startup; skipping table creation")

app = FastAPI(title="radar api", version="1.0.0")

# Serve uploaded files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(posts.router)

@app.on_event("startup")
def on_startup() -> None:
    _create_tables_on_startup()

@app.get("/")
def read_root():
    return {"message": "welcome to radar api"}

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/readyz")
def readyz():
    # Basic readiness check: app import + router mount succeeded
    return {"ready": True}
