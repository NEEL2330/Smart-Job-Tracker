from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobCreate(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "applied"

class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    company: str
    role: str
    location: Optional[str]
    description: Optional[str]
    status: str
    applied_date: datetime

    class Config:
        orm_mode = True

class JobStatusUpdate(BaseModel):
    status: str
