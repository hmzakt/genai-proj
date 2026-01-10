from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceBgeEmbeddings

PERSIST_DIR = "data/chroma"

def get_vectorstore() :
    embeddings = HuggingFaceBgeEmbeddings(
        model_name = "sentence-transformers/all-MiniLM-L6-V2"
    )
    
    return Chroma(
        persist_directory = PERSIST_DIR,
        embedding_function=embeddings
    )