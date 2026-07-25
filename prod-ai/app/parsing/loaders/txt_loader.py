from pathlib import Path
import mimetypes

from app.parsing.cleaners import TextCleaner
from app.parsing.loaders.base import BaseLoader
from app.parsing.models import (
    ParsedDocument,
    ParsedPage,
    DocumentMetadata,
)
from app.parsing.utils.encoding import detect_encoding
from app.parsing.utils.hashing import sha256_file


class TXTLoader(BaseLoader):

    def __init__(self):
        self.cleaner = TextCleaner()

    def load(self, file: Path):
        encoding = detect_encoding(file)

        raw = file.read_text(
            encoding=encoding,
            errors="ignore",
        )

        cleaned = self.cleaner.clean(raw)

        page = ParsedPage(
            page_number=1,
            text=cleaned,
            character_count=len(cleaned),
            word_count=len(cleaned.split()),
        )

        metadata = DocumentMetadata(
            filename=file.name,
            extension=file.suffix,
            mime_type=mimetypes.guess_type(file)[0],
            parser_name="TXTLoader",
            parser_version="1.0",
            page_count=1,
            file_size_bytes=file.stat().st_size,
            encoding=encoding,
            sha256=sha256_file(file),
        )

        return ParsedDocument(
            source_path=file,
            extension=file.suffix,
            metadata=metadata,
            pages=[page],
            raw_text=raw,
            cleaned_text=cleaned,
        )