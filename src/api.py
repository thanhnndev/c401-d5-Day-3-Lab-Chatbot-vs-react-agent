import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

from src.core.gemini_provider import GeminiProvider
from src.agent.agent import ReActAgent
from src.tools.smart_apply import (
    tool_get_country_list_config,
    tool_search_schools_config,
)
from src.tools.get_school_detail import tool_get_school_detail_config
from src.tools.get_programs import tool_get_programs_config
from src.tools.smart_apply_tools import (
    tool_get_program_detail_config,
    tool_submit_application_config,
)

app = FastAPI(title="ReAct Agent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


def initialize_agent():
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment")

    if not os.getenv("SMART_APPLY_AGENT_ID") or not os.getenv("SMART_APPLY_TOKEN"):
        raise ValueError("SMART_APPLY_AGENT_ID and SMART_APPLY_TOKEN must be set")

    llm = GeminiProvider(model_name="gemini-2.5-flash", api_key=gemini_api_key)

    tools = [
        tool_get_country_list_config,
        tool_search_schools_config,
        tool_get_school_detail_config,
        tool_get_programs_config,
        tool_get_program_detail_config,
        tool_submit_application_config,
    ]

    return ReActAgent(llm=llm, tools=tools, max_steps=5)


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        agent = initialize_agent()
        response = agent.run(request.message)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "healthy"}
