from __future__ import annotations

import re

MULTIPLE_SPACES = re.compile(r"[ \t]+")
MULTIPLE_NEWLINES = re.compile(r"\n{3,}")


def normalize_whitespace(text: str) -> str:
    """
    Remove excessive spaces while preserving paragraphs.
    """
    text = text.replace("\r\n", "\n")
    text = text.replace("\r", "\n")

    text = MULTIPLE_SPACES.sub(" ", text)
    text = MULTIPLE_NEWLINES.sub("\n\n", text)

    return text.strip()