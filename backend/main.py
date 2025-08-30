from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import logging
from routers import users, posts, auth

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
    # No DB migrations; Supabase manages schema
    pass

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
