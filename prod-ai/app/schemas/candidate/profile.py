from __future__ import annotations
from typing import Optional
from pydantic import Field

from app.schemas.common import BaseSchema
from app.schemas.candidate.career_gap import CareerGap
from app.schemas.candidate.certification import Certification
from app.schemas.candidate.education import Education
from app.schemas.candidate.enums import SeniorityLevel
from app.schemas.candidate.experience import Experience
from app.schemas.candidate.metadata import Metadata
from app.schemas.candidate.project import Project
from app.schemas.candidate.skill import Skill


class CandidateProfile(BaseSchema):
    """
    Canonical representation of a candidate.
    """

    full_name: Optional[str] = None

    email: Optional[str] = None

    phone: Optional[str] = None

    location: Optional[str] = None

    linkedin: Optional[str] = None

    github: Optional[str] = None

    portfolio: Optional[str] = None

    summary: Optional[str] = None

    seniority: Optional[SeniorityLevel] = None

    skills: list[Skill] = Field(default_factory=list)

    experiences: list[Experience] = Field(default_factory=list)

    projects: list[Project] = Field(default_factory=list)

    education: list[Education] = Field(default_factory=list)

    certifications: list[Certification] = Field(default_factory=list)

    leadership: list[str] = Field(default_factory=list)

    achievements: list[str] = Field(default_factory=list)

    soft_skills: list[str] = Field(default_factory=list)

    industries: list[str] = Field(default_factory=list)

    career_gaps: list[CareerGap] = Field(default_factory=list)

    metadata: Metadata