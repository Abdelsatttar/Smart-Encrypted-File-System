from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class SensitivityLevel(str, Enum):
    HIGH = "HIGH"
    LOW = "LOW"

class FileRecordBase(BaseModel):
    filename: str
    original_size: float
    sensitivity: SensitivityLevel

class FileRecordCreate(FileRecordBase):
    pass

class FileRecordResponse(FileRecordBase):
    id: int
    is_encrypted: int
    upload_date: datetime

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    total_files: int
    encrypted_files: int
    high_sensitivity_files: int
    low_sensitivity_files: int
    total_data_processed_mb: float
