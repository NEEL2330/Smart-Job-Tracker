import json
from app.utils.groq_client import groq_generate

def match_resume_with_job_groq(resume_text: str, job_description: str) -> dict:
    prompt = f"""
Compare the RESUME and JOB DESCRIPTION below.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Return ONLY valid JSON in exactly this format:
{{
  "match_score": number (0-100),
  "strong_skills": [string],
  "missing_skills": [string],
  "suggestions": [string]
}}

Rules:
- match_score must be realistic
- strong_skills and missing_skills must come from resume/JD
- suggestions must be actionable
"""

    raw = groq_generate(prompt)

    # Safety cleanup
    raw = raw.replace("```json", "").replace("```", "").strip()

    return json.loads(raw)
