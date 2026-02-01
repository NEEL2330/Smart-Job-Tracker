from groq import Groq
from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def groq_generate(prompt: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # Best free model on Groq
        messages=[
            {
                "role": "system",
                "content": "You are an ATS (Applicant Tracking System). Respond ONLY in valid JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=500
    )

    return response.choices[0].message.content.strip()
