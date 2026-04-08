import os
from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
import uuid

import models, schemas, encryption
from database import engine, get_db

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SEFS API", description="Smart Encrypted File System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_DIR = "storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

def classify_file(filename: str, size: float) -> schemas.SensitivityLevel:
    # A simple mock classification rule: 
    # extensions like .pdf, .docx, .csv are HIGH, otherwise LOW.
    # Alternatively, large files > 5MB are HIGH.
    high_extensions = ['.pdf', '.docx', '.csv', '.xlsx', '.key', '.pem']
    ext = os.path.splitext(filename)[1].lower()
    
    if ext in high_extensions or size > 5 * 1024 * 1024:
        return schemas.SensitivityLevel.HIGH
    return schemas.SensitivityLevel.LOW

def encrypt_and_update(file_path: str, record_id: int):
    success = encryption.encrypt_file(file_path)
    if success:
        # Update db record
        from database import SessionLocal
        db = SessionLocal()
        record = db.query(models.FileRecord).filter(models.FileRecord.id == record_id).first()
        if record:
            record.is_encrypted = 1
            db.commit()
        db.close()

@app.post("/upload", response_model=schemas.FileRecordResponse)
async def upload_file(background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Read file to get size, then save it
    contents = await file.read()
    size = len(contents)
    
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(STORAGE_DIR, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    sensitivity = classify_file(file.filename, size)
    
    db_record = models.FileRecord(
        filename=file.filename,
        original_size=size,
        file_path=file_path,
        sensitivity=sensitivity,
        is_encrypted=0
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    # Trigger encryption in background if HIGH
    if sensitivity == schemas.SensitivityLevel.HIGH:
        background_tasks.add_task(encrypt_and_update, file_path, db_record.id)
        
    return db_record

@app.get("/files", response_model=List[schemas.FileRecordResponse])
def get_files(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    files = db.query(models.FileRecord).order_by(models.FileRecord.upload_date.desc()).offset(skip).limit(limit).all()
    return files

@app.get("/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    total_files = db.query(models.FileRecord).count()
    encrypted_files = db.query(models.FileRecord).filter(models.FileRecord.is_encrypted == 1).count()
    high_sens = db.query(models.FileRecord).filter(models.FileRecord.sensitivity == schemas.SensitivityLevel.HIGH).count()
    low_sens = db.query(models.FileRecord).filter(models.FileRecord.sensitivity == schemas.SensitivityLevel.LOW).count()
    
    # Sum original size using func.sum
    total_size_bytes = db.query(func.sum(models.FileRecord.original_size)).scalar() or 0
    total_size_mb = total_size_bytes / (1024 * 1024)
    
    return schemas.AnalyticsResponse(
        total_files=total_files,
        encrypted_files=encrypted_files,
        high_sensitivity_files=high_sens,
        low_sensitivity_files=low_sens,
        total_data_processed_mb=round(total_size_mb, 2)
    )
