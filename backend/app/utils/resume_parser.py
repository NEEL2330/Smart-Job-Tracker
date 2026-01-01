from PyPDF2 import PdfReader
import docx

def extract_resume_text(file, filename: str) -> str:
    if filename.endswith(".pdf"):
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text.strip()

    elif filename.endswith(".docx"):
        document = docx.Document(file)
        return "\n".join(p.text for p in document.paragraphs)

    else:
        raise ValueError("Unsupported resume format (PDF or DOCX only)")
