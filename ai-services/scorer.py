import json

def normalize_ai_response(ai_response : str):
    try:
        data = json.loads(ai_response)
        score = min(100, max(0, int(data.get("suitibality_score",0))))
        
        return {
            "skills" : data.get("skills",[]),
            "experience" : data.get("years_of_experience", 0),
            "education" : data.get("education",""),
            "summary" : data.get("match_summary",""),
            "score" : score,
            "status":"processed"
        }
    
    except Exception:
        return {
            "status" : "failed",
            "score" : -1
        }