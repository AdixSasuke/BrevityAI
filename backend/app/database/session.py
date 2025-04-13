from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from .base import AsyncSessionLocal

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async database sessions.
    Use as a FastAPI dependency to get a session in route handlers.
    """
    session = AsyncSessionLocal()
    try:
        yield session
    finally:
        await session.close()