from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path

from app.parsing.models.parsed_document import ParsedDocument


class BaseLoader(ABC):

    @abstractmethod
    def load(
        self,
        file: Path,
    ) -> ParsedDocument:
        """
        Parse document.
        """
        raise NotImplementedError