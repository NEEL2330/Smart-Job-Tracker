# app/routers/job.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.job import Job
from app.schemas.job import JobCreate, JobResponse, JobUpdate, JobStatusUpdate
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_job = Job(
        company=job.company,
        role=job.role,
        description=job.description,
        status=job.status,
        resume_file=job.resume_file,
        user_id=current_user.id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job

@router.get("/")
def get_my_jobs(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    jobs = db.query(Job).filter(Job.user_id == current_user.id).all()
    return jobs

@router.put("/{job_id}")
def update_job(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # ✅ Update all allowed fields
    job.company = data.company
    job.role = data.role
    job.description = data.description
    job.status = data.status
    job.resume_file = data.resume_file

    db.commit()
    db.refresh(job)

    return {
        "message": "Job updated successfully",
        "job": job
    }

@router.patch("/{job_id}/status")
def update_job_status(
    job_id: int,
    data: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    job.status = data.status
    db.commit()
    db.refresh(job)

    return {
        "message": "Job status updated successfully",
        "job": job
    }

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }