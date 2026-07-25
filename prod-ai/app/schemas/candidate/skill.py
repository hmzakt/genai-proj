from __future__ import annotations
from typing import Optional
from pydantic import Field

from app.schemas.common import BaseSchema
from app.schemas.candidate.enums import (
    ProficiencyLevel,
    SkillCategory
)

from app.schemas.candidate.metadata import ConfidenceScore

class Skill(BaseSchema):
    """Representation of candidate skill"""
    
    name : str = Field(
        min_length=1,
        max_length=100,
        description="Skill name"
    )
    
    category : SkillCategory
    
    Proficiency : Optional[ProficiencyLevel] = Field(
        default=None,
        description= "Estimated proficiency"
    )
    
    years_of_experience : Optional[float] = Field(
        default=None,
        ge=0,
        le = 60
    )
    
    last_used_year : Optional[int] = Field(
        default = None, 
        ge = 1980
    )
    
    confidence : ConfidenceScore
    
    aliases : list[str] = Field(
        default_factory=list,
        description="Alternative names"
    )
    
    evidence : list[str] = Field(
        default_factory=list,
        description="Source that verifies this skill"
    )