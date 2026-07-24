from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ConfidenceScore(BaseModel):
    score: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence score between 0 and 1",
    )

    source: str = Field(
        description="How the information was extracted",
    )

    explanation: Optional[str] = None


class Metadata(BaseModel):
    parser_version: str
    extraction_model: str
    extraction_timestamp: datetime
    language: Optional[str] = None
    page_count: Optional[int] = None
    resume_hash: Optional[str] = None