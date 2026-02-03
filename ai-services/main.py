from fastapi import FastAPI
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
    pdf_response = requests.get(data.resume_url)
    resume_text = extract_text_from_pdf(pdf_response.content)
    raw_res = analyze_resume(resume_text, data.job_description)
    result = normalize_ai_response(str(raw_res))
    
    return result


app.include_router(chat_router, prefix="/api")

# uvicorn main:app --reload --port 8000