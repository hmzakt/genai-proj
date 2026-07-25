from pydantic import BaseModel
from app.llm.usage import TokenUsage

class LLMResult(BaseModel):
    content : str
    usage : TokenUsage
    latency_ms : int
    model : str
    finish_reason : str