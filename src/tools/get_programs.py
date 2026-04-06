import requests
import os

def get_programs(school_id: str, search_query: str = None) -> str:
    """Lấy danh sách các chương trình học của một trường cụ thể."""
    host = "https://api-v2.smartapply.ca"
    agent_id = os.getenv("SMART_APPLY_AGENT_ID", "your_agent_id")
    token = os.getenv("SMART_APPLY_TOKEN", "your_token")
    url = f"{host}/api/open-application/{agent_id}/school/{school_id}/program"
    
    params = {
        "token": token,
        "search": search_query,
        "page": 1
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        import json
        raw_results = response.json().get("result", [])
        formatted_programs = []
        for p in raw_results:
            formatted_programs.append({
                "_id": p.get("_id", ""),
                "name": p.get("name", ""),
                "intake": p.get("intake", [])
            })
            
        formatted_response = {
            "statusCode": 200,
            "result": formatted_programs
        }
        return json.dumps(formatted_response, ensure_ascii=False)
    return "No programs found"
