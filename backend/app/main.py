from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.api import auth, users, transcript, audio, download

app = FastAPI(title="Brevity AI API", description="API for transforming YouTube videos into clear, concise content")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(transcript.router, prefix="/api/transcript", tags=["transcript"])
app.include_router(audio.router, prefix="/api/audio", tags=["audio"])
app.include_router(download.router, prefix="/api/download", tags=["download"])

@app.get("/")
async def root():
    return {"message": "Welcome to Brevity AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}