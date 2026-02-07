from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv

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
    print(f"\n{'='*60}")
    print(f"Processing Resume Request")
    print(f"{'='*60}")
    print(f"Resume URL: {data.resume_url}")
    print(f"Job Description Length: {len(data.job_description)} chars")
    
    max_pdf_bytes = int(os.getenv("MAX_PDF_BYTES", "8000000"))
    print(f"Max PDF size: {max_pdf_bytes} bytes")
    
    try:
        print(f"Fetching resume from URL...")
        pdf_response = requests.get(
            data.resume_url,
            timeout=20,
            headers={"User-Agent": "Mozilla/5.0"},
        )
        print(f"HTTP Status: {pdf_response.status_code}")
    except requests.RequestException as exc:
        print(f"Failed to fetch resume: {exc}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch resume: {exc}")

    if pdf_response.status_code != 200:
        print(f"Non-200 response: {pdf_response.status_code}")
        raise HTTPException(status_code=502, detail=f"Failed to fetch resume: HTTP {pdf_response.status_code}")

    content = pdf_response.content
    print(f"Downloaded {len(content)} bytes")
    
    if len(content) > max_pdf_bytes:
        print(f"PDF too large: {len(content)} > {max_pdf_bytes}")
        raise HTTPException(status_code=413, detail="Resume PDF is too large")

    if not content.startswith(b"%PDF"):
        print(f"Invalid PDF format. First 20 bytes: {content[:20]}")
        raise HTTPException(status_code=400, detail="Resume URL did not return a PDF")

    print(f"Valid PDF format detected")

    try:
        print(f"Extracting text from PDF...")
        resume_text = extract_text_from_pdf(content)
        print(f"Extracted {len(resume_text)} characters")
    except Exception as exc:
        print(f"Failed to parse PDF: {exc}")
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {exc}")

    if not resume_text.strip():
        print(f"PDF contained no text")
        raise HTTPException(status_code=422, detail="Parsed PDF contained no text")
    
    print(f" Analyzing resume with AI...")
    raw_res = analyze_resume(resume_text, data.job_description)
    print(f" AI analysis complete")
    
    print(f" Normalizing AI response...")
    result = normalize_ai_response(str(raw_res))
    print(f" Processing complete. Status: {result.get('status', 'unknown')}")
    print(f"{'='*60}\n")
    
    return result


app.include_router(chat_router, prefix="/api")

# uvicorn main:app --reload --port 8000