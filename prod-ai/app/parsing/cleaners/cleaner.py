from __future__ import annotations

from app.parsing.cleaners.normalizers import (
    normalize_bullets,
    normalize_quotes,
    remove_control_characters,
)
from app.parsing.cleaners.unicode import normalize_unicode
from app.parsing.cleaners.whitespace import normalize_whitespace


class TextCleaner:
    """
    Production text cleaning pipeline.
    """

    def clean(self, text: str) -> str:

        if not text:
            return ""

        text = normalize_unicode(text)
        text = remove_control_characters(text)
        text = normalize_quotes(text)
        text = normalize_bullets(text)
        text = normalize_whitespace(text)

        return text