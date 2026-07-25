from pydantic import BaseModel


class DocumentMetadata(BaseModel):
    pages: int
    parser: str
    ocr_used: bool
    language: str | None = None
    file_size_bytes: int
    encoding: str | None = None