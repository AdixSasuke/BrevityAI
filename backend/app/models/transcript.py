from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database.base import Base

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    youtube_id = Column(String, index=True)
    title = Column(String)
    original_text = Column(Text)
    rewritten_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="transcripts")
    audio_files = relationship("AudioFile", back_populates="transcript", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Transcript {self.title[:30]}...>"