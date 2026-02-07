import os
from langchain_chroma import Chroma
import chromadb
from langchain_huggingface import HuggingFaceEmbeddings

PERSIST_DIR = "data/chroma"

def get_vectorstore():
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    
    embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    
    chroma_api_key = os.getenv("CHROMADB_API_KEY")
    chroma_tenant = os.getenv("CHROMADB_TENANT_KEY")
    chroma_db_name = os.getenv("CHROMADB_DB_NAME", "hr_policies")
    
    if chroma_api_key and chroma_tenant:
        client = chromadb.CloudClient(
            api_key = chroma_api_key,
            tenant=chroma_tenant,
            database=chroma_db_name
        )
        
        return Chroma(
            client=client,
            collection_name="hr_knowledge_base",
            embedding_function=embeddings
        )
    else:
        return Chroma(
            persist_directory=PERSIST_DIR,
            embedding_function=embeddings
        )
