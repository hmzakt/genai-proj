from app.llm.gemini import get_llm
from app.prompts.question_generation_prompt import (
    QUESTION_GENERATION_PROMPT
)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def get_question_generation_chain():
    llm = get_llm()
    
    prompt = ChatPromptTemplate.from_template(
        QUESTION_GENERATION_PROMPT
    )
    
    chain = prompt | llm | JsonOutputParser()
    
    return chain
    