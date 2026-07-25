from pydantic import BaseModel

class TokenUsage(BaseModel):
    prompt_tokens : int
    completion_tokens : int
    total_tokens : int
    estimated_cost : float