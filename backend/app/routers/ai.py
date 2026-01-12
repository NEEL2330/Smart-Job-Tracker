import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.utils.resume_parser import extract_resume_text
from app.utils.resume_matcher_groq import match_resume_with_job_groq
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.jobs import get_job_description

router = APIRouter(prefix="/ai", tags=["AI"])

@router.get("/test-groq")
def test_groq():
    prompt = "List 3 backend developer skills"
    return {"response": generate_text(prompt)}

@router.post("/resume-match-groq")
async def resume_match_groq(
    job_id: int,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        job_description = get_job_description(job_id, db)
        resume_text = extract_resume_text(resume.file, resume.filename)

        return match_resume_with_job_groq(resume_text, job_description)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))