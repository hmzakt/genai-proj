class ParserError(Exception):
    """Base parser exception."""


class UnsupportedFileTypeError(ParserError):
    """File type is unsupported."""


class DocumentReadError(ParserError):
    """Document cannot be read."""