from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class ParsedPage(BaseModel):
    """
    Represents a single parsed page from a document.
    """

    model_config = ConfigDict(
        extra="forbid",
        validate_assignment=True,
        str_strip_whitespace=True,
    )

    page_number: int = Field(
        ge=1,
        description="1-indexed page number."
    )

    text: str = Field(
        default="",
        description="Extracted text from this page."
    )

    ocr_used: bool = Field(
        default=False,
        description="Whether OCR was required."
    )

    image_count: int = Field(
        default=0,
        ge=0,
        description="Images detected on this page."
    )

    character_count: int = Field(
        default=0,
        ge=0,
        description="Characters extracted."
    )

    word_count: int = Field(
        default=0,
        ge=0,
        description="Words extracted."
    )