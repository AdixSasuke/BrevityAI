import asyncio
import os
from sqlalchemy.ext.asyncio import AsyncSession

from .base import engine, Base, AsyncSessionLocal
from ..models import User, Transcript, AudioFile

async def init_db():
    """
    Initialize the database by creating all tables.
    """
    # Create instance directory if it doesn't exist
    os.makedirs("./instance", exist_ok=True)
    
    async with engine.begin() as conn:
        # Drop all tables (uncomment for reset, but be careful)
        # await conn.run_sync(Base.metadata.drop_all)
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    print("Database tables created successfully.")

async def seed_db():
    """
    Seed the database with initial data if needed.
    """
    async with AsyncSessionLocal() as session:
        # Add seed data here if needed
        pass
    
    print("Database seeded successfully.")

if __name__ == "__main__":
    """
    Run this script directly to initialize the database.
    """
    asyncio.run(init_db())
    asyncio.run(seed_db())