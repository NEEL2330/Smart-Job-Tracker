from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    location = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="APPLIED")
    applied_date = Column(DateTime(timezone=True), server_default=func.now())

    is_archived = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"))
