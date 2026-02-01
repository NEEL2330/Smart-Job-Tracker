from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate


# ---------------- INTERNAL HELPER ----------------

def _get_job_for_user(job_id: int, user: User, db: Session) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job or job.user_id != user.id:
        raise ValueError("Job not found")

    return job


# ---------------- CREATE ----------------

def create_job(job_data: JobCreate, user: User, db: Session) -> Job:
    job = Job(**job_data.dict(), user_id=user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job


# ---------------- READ (ACTIVE JOBS) ----------------

def get_active_jobs(
    user: User,
    db: Session,
    company: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Job]:

    query = db.query(Job).filter(
        Job.user_id == user.id,
        Job.is_archived == False
    )

    if company:
        query = query.filter(Job.company.ilike(f"{company}%"))
    if role:
        query = query.filter(Job.role.ilike(f"{role}%"))
    if status:
        query = query.filter(Job.status == status)

    return query.order_by(Job.applied_date.desc()).all()


# ---------------- READ (ARCHIVED JOBS) ----------------

def get_archived_jobs(user: User, db: Session) -> List[Job]:
    return (
        db.query(Job)
        .filter(
            Job.user_id == user.id,
            Job.is_archived == True
        )
        .order_by(Job.applied_date.desc())
        .all()
    )


# ---------------- STATS ----------------

def get_job_stats(user: User, db: Session) -> dict:
    jobs = db.query(Job).filter(Job.user_id == user.id).all()

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


# ---------------- UPDATE ----------------

def update_job(
    job_id: int,
    data: JobUpdate,
    user: User,
    db: Session
) -> Job:
    job = _get_job_for_user(job_id, user, db)

    for key, value in data.dict(exclude_unset=True).items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return job


# ---------------- UPDATE STATUS ----------------

def update_job_status(
    job_id: int,
    status: str,
    user: User,
    db: Session
) -> Job:
    job = _get_job_for_user(job_id, user, db)
    job.status = status
    db.commit()
    db.refresh(job)
    return job


# ---------------- ARCHIVE / RESTORE ----------------

def set_job_archive(
    job_id: int,
    archive: bool,
    user: User,
    db: Session
) -> Job:
    job = _get_job_for_user(job_id, user, db)
    job.is_archived = archive
    db.commit()
    db.refresh(job)
    return job


# ---------------- DELETE ----------------

def delete_job(job_id: int, user: User, db: Session) -> None:
    job = _get_job_for_user(job_id, user, db)
    db.delete(job)
    db.commit()

def get_job_description(job_id: int, db: Session) -> str:
    job = db.query(Job).filter(Job.id == job_id).first()

    if not job:
        raise ValueError("Job not found")

    return job.description