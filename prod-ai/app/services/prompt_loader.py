from pathlib import Path
from app.registry.prompt_registry import PromptType

class PromptLoader :
    PROMPT_DIR = (
        Path(__file__).parent.parent/"templates"
    )
    
    @classmethod
    def load(
        cls,
        prompt : PromptType,
        version : str = "v1"
    )->str:
        file = (
            cls.PROMPT_DIR/f"{prompt.value}.{version}.md"
        )
        
        if not file.exists():
            raise FileNotFoundError(file)
        
        return file.read_text(encoding="utf8")