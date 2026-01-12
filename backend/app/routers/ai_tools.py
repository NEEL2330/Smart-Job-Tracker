from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.core import jobs as core_jobs

router = APIRouter(prefix="/ai-tools", tags=["AI Tools"])


# TEMP DEV AUTH (replace later)
def get_user_from_header(
    x_test_user_id: int = Header(...)
) -> User:
    from app.database import SessionLocal
    from app.models.user import User

    db = SessionLocal()
    user = db.query(User).filter(User.id == x_test_user_id).first()
    db.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")

    return user


@router.get("/jobs/by-status")
def get_jobs_by_status(
    status: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_user_from_header),
):
    jobs = core_jobs.get_active_jobs(
        user=user,
        db=db,
        status=status,
    )
    return jobs


@router.patch("/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_user_from_header),
):
    job = core_jobs.update_job_status(
        job_id=job_id,
        status=payload["status"],
        user=user,
        db=db,
    )
    return job

@router.get("/jobs/stats")
def get_job_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_user_from_header),
):
    return core_jobs.get_job_stats(user=user, db=db)