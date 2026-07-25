from pathlib import Path
from pydantic import BaseModel
from app.schemas.document_metadata import DocumentMetadata

class ParsedDocument(BaseModel):
    filename : str
    extension : str
    raw_text : str
    cleaned_text : str
    metadata : DocumentMetadata
    source_path : Path