# SmartApply API Integration Guide

## Setup Environment

### 1. Create `.env` file in project root:

```env
# SmartApply API Credentials
SMART_APPLY_AGENT_ID=your_agent_id_here
SMART_APPLY_TOKEN=your_token_here

# LLM Provider (choose one)
GEMINI_API_KEY=your_gemini_api_key
# OPENAI_API_KEY=your_openai_api_key
```

### 2. Available Tools

All tools are configured to work with the ReAct Agent. Import them in `run_agent.py`:

```python
from src.tools.smart_apply import tool_get_country_list_config, tool_search_schools_config
from src.tools.get_school_detail import tool_get_school_detail_config
from src.tools.get_programs import tool_get_programs_config
from src.tools.smart_apply_tools import (
    get_program_detail,
    submit_student_application,
    tool_get_program_detail_config,
    tool_submit_application_config
)

tools = [
    tool_get_country_list_config,      # API 1: Get Country list
    tool_search_schools_config,        # API 2: Search Schools
    tool_get_school_detail_config,     # API 3: Get School detail
    tool_get_programs_config,          # API 4: Get Programs
    tool_get_program_detail_config,    # API 5: Get Program detail
    tool_submit_application_config     # API 6: Submit application
]
```

## API Reference

| # | API | Tool Function | Endpoint |
|---|-----|---------------|----------|
| 1 | Get Country list | `get_country_list()` | `GET /api/zone/country` |
| 2 | Search Schools | `search_schools(country, search)` | `GET /api/open-application/{agentID}/school` |
| 3 | Get School detail | `get_school_detail(school_id)` | `GET /api/open-application/{agentID}/school/{schoolID}` |
| 4 | Get Programs | `get_programs(school_id, search_query)` | `GET /api/open-application/{agentID}/school/{schoolID}/program` |
| 5 | Get Program detail | `get_program_detail(program_id)` | `GET /api/open-application/{agentID}/program/{programId}` |
| 6 | Submit application | `submit_student_application(...)` | `POST /api/open-application/{agentID}/application` |

## Running the Agent

```bash
# Install dependencies
pip install -r requirements.txt

# Run the agent
python run_agent.py
```

## Example Usage

```
User >> Find schools in Canada

⏳ Đang suy nghĩ...

Thought: I need to search for schools in Canada.
Action: search_schools(country='Canada')
Observation: [List of schools...]

Final Result: Here are the schools in Canada...
```
