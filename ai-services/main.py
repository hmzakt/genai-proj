from fastapi import FastAPI
from pydantic import BaseModel
import requests

from resume_parser import extract_text_from_pdf
from gemini_client import analyze_resume
from scorer import normalize_ai_response

app = FastAPI()

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

# uvicorn main:app --reload --port 8000
