from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_resume(resume_text:str, job_description:str):
    prompt = f"""
        You are an HR Screening assistant.
        
        JOB DESCRIPTION:
        {job_description}
        
        RESUME:
        {resume_text}
        
        Extract the following information in JSON format:
            - name (string): Full name of the candidate
            - email (string): Email address of the candidate
            - skills (list of strings): Technical and soft skills
            - years_of_experience (number): Total years of work experience
            - education (string): Highest education level and degree
            - match_summary (string): Brief summary of how well the candidate matches the job (2-3 sentences)
            - suitability_score (number 0-100): Overall match score
            
            RETURN ONLY VALID JSON, NO MARKDOWN
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text


