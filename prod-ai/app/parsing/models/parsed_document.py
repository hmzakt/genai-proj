from pathlib import Path
from pydantic import BaseModel
from app.parsing.models.document_metadata import DocumentMetadata
from .parsed_page import ParsedPage


class ParsedDocument(BaseModel):
    filename: str | None = None
    extension: str
    raw_text: str
    cleaned_text: str
    metadata: DocumentMetadata
    source_path: Path
    pages: list[ParsedPage]