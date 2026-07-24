from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import Field, model_validator

from app.schemas.common import BaseSchema
from app.schemas.candidate.enums import DegreeType
from app.schemas.candidate.metadata import ConfidenceScore


class Education(BaseSchema):
    """
    Educational qualification.
    """

    institution: str = Field(
        min_length=2,
        max_length=200,
    )

    degree: DegreeType

    field_of_study: Optional[str] = None

    specialization: Optional[str] = None

    start_date: Optional[date] = None

    end_date: Optional[date] = None

    grade: Optional[str] = Field(
        default=None,
        description="CGPA, GPA, Percentage, etc."
    )

    location: Optional[str] = None

    achievements: list[str] = Field(
        default_factory=list
    )

    relevant_courses: list[str] = Field(
        default_factory=list
    )

    confidence: ConfidenceScore

    @model_validator(mode="after")
    def validate_dates(self):
        if (
            self.start_date
            and self.end_date
            and self.end_date < self.start_date
        ):
            raise ValueError(
                "end_date cannot be earlier than start_date"
            )

        return self