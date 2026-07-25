from __future__ import annotations

import unicodedata

def normalize_unicode(text : str)-> str:
    """
    Normalize unicode characters
    """
    
    if not text : 
        return ""
    
    return unicodedata.normalize("NFKC", text)
    