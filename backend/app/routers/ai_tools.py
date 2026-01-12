from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Job

router = APIRouter(
    prefix="/ai-tools",
    tags=["AI Tools"]
)

# -------------------------
# GET JOBS BY STATUS (already working)
# -------------------------
@router.get("/jobs/by-status")
def get_jobs_by_status(
    status: str,
    x_test_user_id: int = Header(...),
    db: Session = Depends(get_db),
):
    return db.query(Job).filter(
        Job.user_id == x_test_user_id,
        Job.status == status.upper()
    ).all()


# -------------------------
# UPDATE JOB STATUS (NEW)
# -------------------------
@router.patch("/jobs/{job_id}/status")
def update_job_status(
    job_id: int,
    status: dict,
    x_test_user_id: int = Header(...),
    db: Session = Depends(get_db),
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == x_test_user_id
    ).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job.status = status["status"].upper()
    db.commit()
    db.refresh(job)

    return {
        "message": "Job status updated successfully",
        "job_id": job.id,
        "new_status": job.status
    }
