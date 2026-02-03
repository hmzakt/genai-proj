from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.rag.chain import get_hr_chain

router = APIRouter()

# Initialize chain once at startup
hr_chain = get_hr_chain()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    HR RAG Chat Endpoint
    - Uses LCEL-based LangChain pipeline
    - Gemini for generation
    - ChromaDB for retrieval
    """
    # Use pre-initialized chain
    answer = await hr_chain.ainvoke(req.question)
    
    # Extract sources from the retriever step if needed
    # For now, return empty sources since we're using the chain directly
    
    return ChatResponse(
        answer=answer,
        sources=[],
    )
