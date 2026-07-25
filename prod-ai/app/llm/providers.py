from enum import Enum

class Provider(str, Enum):
    OPENAI = "openai"
    GEMINI = "gemini"
    CLAUDE = "anthropic"
    OLLAMA = "ollama"
    OPENROUTER = "openrouter"
    