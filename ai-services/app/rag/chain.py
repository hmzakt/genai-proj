import os
from dotenv import load_dotenv
load_dotenv()

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from app.vectorstore.chroma import get_vectorstore
from app.rag.prompts import HR_SYSTEM_PROMPT


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def get_hr_chain():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
    )
    retriever = get_vectorstore().as_retriever(search_kwargs={"k": 4})
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", HR_SYSTEM_PROMPT),
            (
                "human",
                """Answer the question using ONLY the context below.

Context:
{context}

Question:
{question}
""",
            ),
        ]
    )

    chain = (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    return chain


# answer = chain.invoke("How are bonuses calculated?")
