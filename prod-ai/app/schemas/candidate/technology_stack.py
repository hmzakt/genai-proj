from __future__ import annotations

from pydantic import Field

from app.schemas.common import BaseSchema


class TechnologyStack(BaseSchema):
    """
    Technologies used within a project or work experience.
    """

    languages: list[str] = Field(default_factory=list)

    frameworks: list[str] = Field(default_factory=list)

    databases: list[str] = Field(default_factory=list)

    cloud: list[str] = Field(default_factory=list)

    devops: list[str] = Field(default_factory=list)

    tools: list[str] = Field(default_factory=list)

    libraries: list[str] = Field(default_factory=list)

    other: list[str] = Field(default_factory=list)

    @property
    def all(self) -> list[str]:
        return (
            self.languages
            + self.frameworks
            + self.databases
            + self.cloud
            + self.devops
            + self.tools
            + self.libraries
            + self.other
        )