import json

def normalize_ai_response(ai_response : str):
    try:
        # Remove markdown code blocks if present
        cleaned = ai_response.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        data = json.loads(cleaned)
        score = min(100, max(0, int(data.get("suitability_score", 0))))
        
        return {
            "name": data.get("name", "Unknown Candidate"),
            "email": data.get("email", ""),
            "skills" : data.get("skills",[]),
            "experience" : data.get("years_of_experience", 0),
            "education" : data.get("education",""),
            "summary" : data.get("match_summary",""),
            "score" : score,
            "status":"processed"
        }
    
    except Exception as e:
        print(f"ERROR parsing AI response: {e}")
        print(f"Raw response: {ai_response[:200]}")
        return {
            "status" : "failed",
            "score" : -1
        }