from .base import BaseLoader
from .docx_loader import DOCXLoader
from .txt_loader import TXTLoader

__all__ = [
    "BaseLoader",
    "TXTLoader",
    "DOCXLoader",
]