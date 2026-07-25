from enum import Enum

class PromptType(str,Enum):
    RESUME_UNDERSTANDING = "resume_understanding"
    JD_UNDERSTANDING = "jd_understanding"
    MATCHING = "matching"
    REASONING = "reasoning"