from __future__ import annotations

import re

CONTROL_CHARACTERS = re.compile(
    r"[\x00-\x08\x0B\x0C\x0E-\x1F]"
)

BULLET_REPLACEMENTS = {
    "•": "-",
    "▪": "-",
    "◦": "-",
    "●": "-",
    "‣": "-",
    "∙": "-",
}


def normalize_bullets(text: str) -> str:

    for source, target in BULLET_REPLACEMENTS.items():
        text = text.replace(source, target)

    return text


def remove_control_characters(text: str) -> str:
    return CONTROL_CHARACTERS.sub("", text)


def normalize_quotes(text: str) -> str:

    replacements = {
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
    }

    for source, target in replacements.items():
        text = text.replace(source, target)

    return text