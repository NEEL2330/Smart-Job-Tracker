from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.job import Job
from app.schemas.job import (
    JobCreate,
    JobUpdate,
    JobStatusUpdate,
    JobResponse
)
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

# -------------------- DB DEPENDENCY --------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- CREATE JOB --------------------
@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_job = Job(
        company=job.company,
        role=job.role,
        location=job.location,
        description=job.description,
        status=job.status,
        user_id=current_user.id
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# -------------------- GET MY JOBS (FILTER + PREFIX SEARCH) --------------------
@router.get("/", response_model=list[JobResponse])
def get_my_jobs(
    company: str | None = Query(default=None),
    role: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Job).filter(Job.user_id == current_user.id)

    # Prefix-based filtering (optimized)
    if company:
        query = query.filter(Job.company.ilike(f"{company}%"))

    if role:
        query = query.filter(Job.role.ilike(f"{role}%"))

    if status:
        query = query.filter(Job.status == status)

    jobs = query.order_by(Job.applied_date.desc()).all()
    return jobs


# -------------------- UPDATE JOB (SAFE PARTIAL UPDATE) --------------------
@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Safe updates (no accidental null overwrite)
    if data.company is not None:
        job.company = data.company

    if data.role is not None:
        job.role = data.role

    if data.location is not None:
        job.location = data.location

    if data.description is not None:
        job.description = data.description

    if data.status is not None:
        job.status = data.status

    db.commit()
    db.refresh(job)

    return job


# -------------------- UPDATE STATUS ONLY --------------------
@router.patch("/{job_id}/status", response_model=JobResponse)
def update_job_status(
    job_id: int,
    data: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    job.status = data.status
    db.commit()
    db.refresh(job)

    return job


# -------------------- DELETE JOB --------------------
@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully"}
