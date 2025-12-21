import google.generativeai as genai
from google.generativeai.generative_models import GenerativeModel
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # type: ignore
model = GenerativeModel("gemini-2.0-flash-exp")

def analyze_resume(resume_text:str, job_description:str):
    prompt = f"""
        You are an HR Screening assistant,
        
        JOB DESCRIPIPTION:
        {job_description}
        
        RESUME:
        {resume_text}
        
        Extract the following in JSON:
            - skills(list)
            - years_of_experience(number)
            - education (string)
            - match_summary (short string)
            - suitability_score(0-100)
            
            RETURN ONLY VALID JSON
    """
    
    response = model.generate_content(prompt)
    return response.text


