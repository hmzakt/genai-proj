import os
import chromadb
from langchain_chroma import Chroma
import voyageai
from dotenv import load_dotenv


PERSIST_DIR = "data/chroma"

load_dotenv()

voyage_client = voyageai.Client(
    api_key=os.getenv("VOYAGE_API_KEY")
)

class VoyageEmbeddingFunction:
    def __init__(self, model: str = "voyage-2"):
        self.model = model

    def embed_documents(self, texts):
        response = voyage_client.embed(
            texts=texts,
            model=self.model
        )
        return response.embeddings

    def embed_query(self, text):
        response = voyage_client.embed(
            texts=[text],
            model=self.model
        )
        return response.embeddings[0]


def get_vectorstore():
    """
    Signature preserved exactly so no other files break.
    """

    embeddings = VoyageEmbeddingFunction(model="voyage-2")

    chroma_api_key = os.getenv("CHROMADB_API_KEY")
    chroma_tenant = os.getenv("CHROMADB_TENANT_KEY")
    chroma_db_name = os.getenv("CHROMADB_DB_NAME", "hr_policies")

    if chroma_api_key and chroma_tenant:
        client = chromadb.CloudClient(
            api_key=chroma_api_key,
            tenant=chroma_tenant,
            database=chroma_db_name
        )
        return Chroma(
            client=client,
            collection_name="hr_knowledge_base_v2",
            embedding_function=embeddings
        )
    else:
        return Chroma(
            persist_directory=PERSIST_DIR,
            embedding_function=embeddings
        )
