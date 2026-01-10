from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    role: str 

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
