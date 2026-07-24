from __future__ import annotations

from datetime import date 
from typing import Optional
from pydantic import Field
from app.schemas.common import BaseSchema
from app.schemas.candidate.metadata import ConfidenceScore

class Certification(BaseSchema):
    """
    Professional certifications
    """
    name : str = Field(
        min_length=2,
        max_length=200
    )
    
    issuer : str = Field(
        min_length=2,
        max_length = 150
    )
    
    issue_date :Optional[date] = None
    expiry_date : Optional[date] = None
    credential_id : Optional[str] = None
    credential_url : Optional[str] = None
    
    skills : list[str] = Field(
        default_factory=list,
        description="Skills validated by certification"
    )
    
    confidence : ConfidenceScore