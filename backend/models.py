from sqlalchemy import Column, Integer, String, DateTime, Enum, Float
import enum
import datetime
from database import Base

class SensitivityLevel(str, enum.Enum):
    HIGH = "HIGH"
    LOW = "LOW"

class FileRecord(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    original_size = Column(Float) # in bytes
    file_path = Column(String)
    sensitivity = Column(Enum(SensitivityLevel))
    is_encrypted = Column(Integer, default=0) # 0 for False, 1 for True
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
