from __future__ import annotations

from pydantic import Field, BaseModel


class OCRPage(BaseModel):

    page_number: int = Field(
        ge=1
    )

    text: str
    confidence: float | None = None


class OCRResult(BaseModel):

    pages: list[OCRPage] = Field(
        default_factory=list
    )

    provider: str
    duration_ms: int
    language: str | None = None

    @property
    def full_text(self) -> str:
        return "\n\n".join(
            page.text
            for page in self.pages
        )