from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.job import JobCreate, JobUpdate, JobStatusUpdate, JobResponse
from app.utils.auth import get_current_user
from app.models.user import User
from app.services import job_service

router = APIRouter(prefix="/jobs", tags=["Jobs"])


# ---------------- CREATE ----------------

@router.post("", response_model=JobResponse)
def create_job(
    job: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return job_service.create_job(job, current_user, db)


# ---------------- ACTIVE JOBS ----------------

@router.get("", response_model=list[JobResponse])
def get_my_jobs(
    company: str | None = Query(None),
    role: str | None = Query(None),
    status: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return job_service.get_active_jobs(
        current_user, db, company, role, status
    )


# ---------------- ARCHIVED JOBS ----------------

@router.get("/archived", response_model=list[JobResponse])
def get_archived_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return job_service.get_archived_jobs(current_user, db)


# ---------------- STATS ----------------

@router.get("/stats")
def get_job_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return job_service.get_job_stats(current_user, db)


# ---------------- UPDATE ----------------

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: int,
    data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return job_service.update_job(job_id, data, current_user, db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---------------- UPDATE STATUS ----------------

@router.patch("/{job_id}/status", response_model=JobResponse)
def update_job_status(
    job_id: int,
    data: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return job_service.update_job_status(
            job_id, data.status, current_user, db
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---------------- ARCHIVE / RESTORE ----------------

@router.patch("/{job_id}/archive", response_model=JobResponse)
def archive_job(
    job_id: int,
    archive: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return job_service.set_job_archive(
            job_id, archive, current_user, db
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---------------- DELETE ----------------

@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        job_service.delete_job(job_id, current_user, db)
        return {"message": "Job deleted"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
