from fastapi import APIRouter
from app.schemas.chat import ChatRequest, ChatResponse
from app.rag.chain import get_hr_chain
from app.vectorstore.chroma import get_vectorstore

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    HR RAG Chat Endpoint
    - Uses LCEL-based LangChain pipeline
    - Gemini for generation
    - ChromaDB for retrieval
    """
    chain = get_hr_chain()

    # 2️⃣ Retrieve documents explicitly (for sources)
    retriever = get_vectorstore().as_retriever(search_kwargs={"k": 4})
    docs = retriever.invoke(req.question)

    answer = await chain.ainvoke(req.question)

    sources = list(
        {
            doc.metadata.get("source", "unknown")
            for doc in docs
        }
    )

    return ChatResponse(
        answer=answer,
        sources=sources,
    )
