from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate

from app.core import jobs as core_jobs


def create_job(job: JobCreate, user: User, db: Session):
    return core_jobs.create_job(job, user, db)


def get_active_jobs(user: User, db: Session, company=None, role=None, status=None):
    return core_jobs.get_active_jobs(user, db, company, role, status)


def get_archived_jobs(user: User, db: Session):
    return core_jobs.get_archived_jobs(user, db)


def get_job_stats(user: User, db: Session):
    return core_jobs.get_job_stats(user, db)


def update_job(job_id: int, data: JobUpdate, user: User, db: Session):
    return core_jobs.update_job(job_id, data, user, db)


def update_job_status(job_id: int, status: str, user: User, db: Session):
    return core_jobs.update_job_status(job_id, status, user, db)


def set_job_archive(job_id: int, archive: bool, user: User, db: Session):
    return core_jobs.set_job_archive(job_id, archive, user, db)


def delete_job(job_id: int, user: User, db: Session):
    return core_jobs.delete_job(job_id, user, db)
