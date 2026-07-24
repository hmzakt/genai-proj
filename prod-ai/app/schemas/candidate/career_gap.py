from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import Field

from app.schemas.common import BaseSchema
from app.schemas.candidate.metadata import ConfidenceScore


class CareerGap(BaseSchema):
    """
    Gap between two professional experiences.
    """

    start_date: date

    end_date: date

    duration_months: int = Field(
        ge=0
    )

    reason: Optional[str] = None

    explanation_available: bool = False

    confidence: ConfidenceScore