import json
from app.utils.groq_client import groq_generate

def match_resume_with_job(resume_text: str, job_description: str) -> dict:
    """Match resume with job description using Groq AI (Llama 3.1)."""
    prompt = f"""You are an ATS (Applicant Tracking System). Analyze the resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY valid JSON in exactly this format (no markdown, no code blocks):
{{
  "match_score": number (0-100),
  "strong_skills": ["list of skills from resume that match JD"],
  "missing_skills": ["list of required skills from JD not in resume"],
  "suggestions": ["actionable improvement suggestions"]
}}

Rules:
- match_score must be a realistic percentage
- strong_skills and missing_skills must come from the actual resume and JD
- suggestions must be specific and actionable
"""

    raw = groq_generate(prompt)

    # Safety cleanup - remove markdown code blocks if present
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)
