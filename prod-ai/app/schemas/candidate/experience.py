from __future__ import annotations

from datetime import date
from typing import Optional

from pydantic import Field, computed_field, model_validator

from app.schemas.common import BaseSchema
from app.schemas.candidate.enums import EmploymentType
from app.schemas.candidate.metadata import ConfidenceScore
from app.schemas.candidate.technology_stack import TechnologyStack


class Experience(BaseSchema):
    """
    Professional work experience.
    """

    company: str

    title: str

    employment_type: EmploymentType

    location: Optional[str] = None

    start_date: date

    end_date: Optional[date] = None

    is_current: bool = False

    summary: Optional[str] = None

    responsibilities: list[str] = Field(default_factory=list)

    achievements: list[str] = Field(default_factory=list)

    technologies: TechnologyStack = Field(
        default_factory=TechnologyStack
    )

    confidence: ConfidenceScore

    @computed_field
    @property
    def duration_months(self) -> Optional[int]:
        if self.start_date is None:
            return None

        end = self.end_date or date.today()

        return (
            (end.year - self.start_date.year) * 12
            + end.month
            - self.start_date.month
        )

    @model_validator(mode="after")
    def validate_dates(self):

        if self.is_current and self.end_date is not None:
            raise ValueError(
                "Current job cannot have end_date."
            )

        if (
            self.end_date
            and self.end_date < self.start_date
        ):
            raise ValueError(
                "End date cannot precede start date."
            )

        return self