import json
from app.utils.groq_client import generate_text

def match_resume_with_job(resume_text: str, job_description: str) -> dict:
    prompt = f"""
You are an ATS (Applicant Tracking System).

Compare the RESUME and JOB DESCRIPTION below.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY valid JSON in this exact format:
{{
  "match_score": number (0-100),
  "strong_skills": [string],
  "missing_skills": [string],
  "suggestions": [string]
}}
"""

    response = generate_text(prompt)

    # Safety cleanup
    response = response.replace("```json", "").replace("```", "").strip()

    return json.loads(response)
