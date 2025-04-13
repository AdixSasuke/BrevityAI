from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database.base import Base

class AudioFile(Base):
    __tablename__ = "audio_files"

    id = Column(Integer, primary_key=True, index=True)
    transcript_id = Column(Integer, ForeignKey("transcripts.id"))
    cloudinary_url = Column(String)
    public_id = Column(String)
    file_type = Column(String)  # original/rewritten
    voice_model = Column(String)  # Which TTS voice model was used
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    transcript = relationship("Transcript", back_populates="audio_files")

    def __repr__(self):
        return f"<AudioFile {self.id}: {self.file_type}>"