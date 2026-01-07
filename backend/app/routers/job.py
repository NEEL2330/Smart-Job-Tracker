from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.job import Job
from app.schemas.job import JobCreate, JobUpdate, JobStatusUpdate, JobResponse
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- CREATE JOB ----------------
@router.post("/", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_job = Job(**job.dict(), user_id=current_user.id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


# ---------------- ACTIVE JOBS ----------------
@router.get("/", response_model=list[JobResponse])
def get_my_jobs(
    company: str | None = Query(None),
    role: str | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Job).filter(
        Job.user_id == current_user.id,
        Job.is_archived == False,
    )

    if company:
        query = query.filter(Job.company.ilike(f"{company}%"))
    if role:
        query = query.filter(Job.role.ilike(f"{role}%"))
    if status:
        query = query.filter(Job.status == status)

    return query.order_by(Job.applied_date.desc()).all()


# ---------------- ARCHIVED JOBS ----------------
@router.get("/archived", response_model=list[JobResponse])
def get_archived_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Job)
        .filter(
            Job.user_id == current_user.id,
            Job.is_archived == True,
        )
        .order_by(Job.applied_date.desc())
        .all()
    )


# ---------------- STATS (ACTIVE + ARCHIVED) ----------------
@router.get("/stats")
def get_job_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    jobs = (
        db.query(Job)
        .filter(Job.user_id == current_user.id)
        .all()
    )

    stats = {
        "total": 0,
        "APPLIED": 0,
        "INTERVIEW": 0,
        "OFFER": 0,
        "REJECTED": 0,
    }

    for job in jobs:
        stats["total"] += 1
        stats[job.status] += 1

    return stats


# ---------------- UPDATE JOB ----------------
@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return job


# ---------------- UPDATE STATUS ----------------
@router.patch("/{job_id}/status", response_model=JobResponse)
def update_job_status(
    job_id: int,
    data: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = data.status
    db.commit()
    db.refresh(job)
    return job


# ---------------- ARCHIVE / RESTORE ----------------
@router.patch("/{job_id}/archive", response_model=JobResponse)
def archive_job(
    job_id: int,
    archive: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    job.is_archived = archive
    db.commit()
    db.refresh(job)
    return job


# ---------------- DELETE ----------------
@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job or job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")

    db.delete(job)
    db.commit()
    return {"message": "Job deleted"}
