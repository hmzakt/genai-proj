import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.vectorstore.chroma import get_vectorstore

# Get absolute path to data directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DOCS_PATH = BASE_DIR / "data" / "hr_docs"

def ingest_documents():
    documents = []
    
    if not DOCS_PATH.exists():
        print(f"Error: Documents path does not exist: {DOCS_PATH}")
        return
    
    for file in os.listdir(DOCS_PATH):
        path = os.path.join(DOCS_PATH, file)
        
        if file.endswith(".pdf"):
            loader = PyPDFLoader(path)
            documents.extend(loader.load())
            print(f"Loaded PDF: {file}")
            
        elif file.endswith(".txt") or file.endswith(".md"):
            loader = TextLoader(path)
            documents.extend(loader.load())
            print(f"Loaded text file: {file}")
    
    if not documents:
        print("No documents found to ingest")
        return
    
    print(f"Total documents loaded: {len(documents)}")
    
    splitter = RecursiveCharacterTextSplitter(
        chunk_size = 800,
        chunk_overlap = 100
    )
    
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    
    vectorstore = get_vectorstore()
    vectorstore.add_documents(chunks)
    vectorstore.persist()
    
    print(f"Data ingestion successful! Ingested {len(chunks)} chunks from {len(documents)} documents")


if __name__ == "__main__":
    ingest_documents()


