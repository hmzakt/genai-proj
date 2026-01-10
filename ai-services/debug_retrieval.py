from app.vectorstore.chroma import get_vectorstore
import asyncio

async def debug():
    print("--- Debugging Retrieval ---")
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
    
    question = "How are bonuses calculated?"
    print(f"Question: {question}")
    
    docs = await retriever.ainvoke(question)
    
    print(f"\nFound {len(docs)} documents:")
    for i, doc in enumerate(docs):
        print(f"\n--- Doc {i+1} ---")
        print(f"Source: {doc.metadata.get('source')}")
        print(f"Content Preview: {doc.page_content[:200]}...")
        print("----------------")

if __name__ == "__main__":
    asyncio.run(debug())
