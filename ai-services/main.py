from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
import gc

# Load environment variables first
load_dotenv()

from resume_parser import extract_text_from_pdf
from gemini_client import analyze_resume
from scorer import normalize_ai_response
from app.api.chat import router as chat_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS configuration for development and production
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResumeRequest(BaseModel):
    resume_url:str
    job_description:str

@app.post("/process-resume")
def process_resume(data:ResumeRequest):
    max_pdf_bytes = int(os.getenv("MAX_PDF_BYTES", "8000000"))
    try:
        pdf_response = requests.get(
            data.resume_url,
            timeout=20,
            headers={"User-Agent": "Mozilla/5.0"},
        )
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Failed to fetch resume: {exc}")

    if pdf_response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch resume: non-200 response")

    content = pdf_response.content
    if len(content) > max_pdf_bytes:
        raise HTTPException(status_code=413, detail="Resume PDF is too large")

    if not content.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Resume URL did not return a PDF")

    try:
        resume_text = extract_text_from_pdf(content)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {exc}")

    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Parsed PDF contained no text")
    raw_res = analyze_resume(resume_text, data.job_description)
    result = normalize_ai_response(str(raw_res))
    
    # Force garbage collection to free memory
    del content, resume_text, raw_res
    gc.collect()
    
    return result


app.include_router(chat_router, prefix="/api")

# uvicorn main:app --reload --port 8000