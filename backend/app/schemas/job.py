from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class JobBase(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    is_archived: Optional[bool] = None


class JobCreate(JobBase):
    company: str
    role: str


class JobUpdate(JobBase):
    pass


class JobStatusUpdate(BaseModel):
    status: str


class JobResponse(JobBase):
    id: int
    applied_date: datetime

    class Config:
        from_attributes = True
