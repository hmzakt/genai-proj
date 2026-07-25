from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class DocumentMetadata(BaseModel):
    """
    Metadata describing the parsed document.
    """

    model_config = ConfigDict(
        extra="forbid",
        validate_assignment=True,
        str_strip_whitespace=True,
    )

    filename: str

    extension: str

    mime_type: Optional[str] = None

    parser_name: str

    parser_version: str

    file_size_bytes: int = Field(
        ge=0
    )

    page_count: int = Field(
        ge=1
    )

    language: Optional[str] = None

    encoding: Optional[str] = None

    ocr_used: bool = False

    sha256: Optional[str] = None

    parsed_at: datetime = Field(
        default_factory=datetime.utcnow
    )