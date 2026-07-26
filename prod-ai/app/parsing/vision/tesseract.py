from pathlib import Path
import time

import pytesseract

from pdf2image import convert_from_path

from app.parsing.vision.base import BaseVisionProvider
from app.parsing.vision.models import (
    OCRPage,
    OCRResult,
)

config = (
    "--oem 3 "
    "--psm 6"
)

class TesseractVisionProvider(
    BaseVisionProvider
):

    def extract(
        self,
        file: Path,
    ) -> OCRResult:

        start = time.perf_counter()

        images = convert_from_path(file)

        pages = []

        for i, image in enumerate(images):

            text = pytesseract.image_to_string(
                image,
                lang="eng + hin",
                config=config
            )

            pages.append(
                OCRPage(
                    page_number=i + 1,
                    text=text,
                )
            )

        elapsed = int(
            (time.perf_counter() - start)
            * 1000
        )

        return OCRResult(
            provider="tesseract",
            duration_ms=elapsed,
            pages=pages,
        )