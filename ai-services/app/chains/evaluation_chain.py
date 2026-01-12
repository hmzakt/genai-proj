from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.llm.gemini import get_llm
from app.prompts.evaluation_prompt import EVALUATION_PROMPT

def get_evaluation_chain():
    llm = get_llm()

    prompt = ChatPromptTemplate.from_template(
        EVALUATION_PROMPT
    )

    chain = prompt | llm | JsonOutputParser()

    return chain
