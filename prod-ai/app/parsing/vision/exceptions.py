class OCRException(Exception):
    """Base OCR exception."""


class OCRFailedException(OCRException):
    """OCR could not be completed."""