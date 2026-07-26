from abc import ABC, abstractmethod
from pathlib import Path

from app.parsing.vision.models import OCRResult


class BaseVisionProvider(ABC):

    @abstractmethod
    def extract(
        self,
        file: Path,
    ) -> OCRResult:
        ...