import json
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.utils.resume_parser import extract_resume_text
from app.utils.resume_matcher import match_resume_with_job
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.jobs import get_job_description

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/resume-match/")
async def resume_match(
    job_id: int,
    resume: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Match a resume against a job description using Groq AI."""
    try:
        job_description = get_job_description(job_id, db)
        resume_text = extract_resume_text(resume.file, resume.filename)

        return match_resume_with_job(resume_text, job_description)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        import traceback
        print(f"ERROR in resume_match: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-resume/")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = ""
):
    """Analyze a resume with an optional job description."""
    try:
        resume_text = extract_resume_text(resume.file, resume.filename)
        
        if job_description:
            return match_resume_with_job(resume_text, job_description)
        else:
            # Simple resume analysis without job matching
            from app.utils.groq_client import groq_generate
            
            prompt = f"""Analyze this resume and provide feedback.

RESUME:
{resume_text}

Return ONLY valid JSON (no code blocks):
{{
  "overall_score": number (0-100),
  "strengths": ["list of resume strengths"],
  "improvements": ["list of areas to improve"],
  "summary": "brief summary of the candidate"
}}
"""
            raw = groq_generate(prompt)
            raw = raw.replace("```json", "").replace("```", "").strip()
            return json.loads(raw)

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))