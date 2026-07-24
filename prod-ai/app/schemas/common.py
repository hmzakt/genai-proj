from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, ConfigDict, Field

class BaseSchema(BaseModel):
    """
    Every domian model inherits this
    """
    
    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        extra="forbid",
        frozen = False,
        str_strip_whitespace=True
    )

class TimestampMixin(BaseModel):
    created_at : datetime = Field(default_factory=datetime.utcnow)
    updated_at : datetime = Field(default_factory=datetime.utcnow)

class UUIDMixin(BaseModel):
    id : UUID = Field(default_factory=uuid4)