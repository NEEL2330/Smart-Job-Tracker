# app/schemas/job.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobCreate(BaseModel):
    company: str
    role: str
    description: Optional[str] = None
    status: Optional[str] = "applied"
    resume_file: Optional[str] = None

class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    resume_file: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    description: Optional[str]
    status: str
    applied_date: datetime
    resume_file: Optional[str]

    class Config:
        orm_mode = True

class JobStatusUpdate(BaseModel):
    status: str