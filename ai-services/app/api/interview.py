from fastapi import APIRouter
from app.chains.question_generation_chain import (
    get_question_generation_chain
)
from app.chains.evaluation_chain import (
    get_evaluation_chain
)

router = APIRouter(prefix="/interview")


@router.post("/questions")
async def generate_questions(payload: dict):
    chain = get_question_generation_chain()

    result = await chain.ainvoke({
        "role": payload["role"],
        "experience": payload["experience"],
        "interview_type": payload["type"],
        "num_questions": payload.get("num_questions", 5),
    })

    return { "questions": result }


@router.post("/evaluate")
async def evaluate_answer(payload: dict):
    chain = get_evaluation_chain()

    result = await chain.ainvoke({
        "role": payload["role"],
        "question": payload["question"],
        "answer": payload["answer"],
    })

    return result
