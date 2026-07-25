from pathlib import Path

import chardet


def detect_encoding(file: Path) -> str:
    raw = file.read_bytes()
    result = chardet.detect(raw)
    return result["encoding"] or "utf-8"