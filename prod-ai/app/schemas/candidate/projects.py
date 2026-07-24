from __future__ import annotations

from typing import Optional

from pydantic import AnyHttpUrl, Field

from app.schemas.common import BaseSchema
from app.schemas.candidate.metadata import ConfidenceScore
from app.schemas.candidate.technology_stack import TechnologyStack


class Project(BaseSchema):
    """
    Candidate project.
    """

    title: str

    description: str

    role: Optional[str] = None

    technologies: TechnologyStack = Field(
        default_factory=TechnologyStack
    )

    github_url: Optional[AnyHttpUrl] = None

    demo_url: Optional[AnyHttpUrl] = None

    highlights: list[str] = Field(default_factory=list)

    outcomes: list[str] = Field(default_factory=list)

    confidence: ConfidenceScore