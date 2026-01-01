from app.database import get_db
from app.models.job import Job
from sqlalchemy.orm import Session

def get_job_description(job_id: int, db: Session) -> str:
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise ValueError("Job not found")

    return job.description
