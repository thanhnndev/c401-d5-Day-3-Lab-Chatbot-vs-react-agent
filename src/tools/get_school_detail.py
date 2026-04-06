import requests
import os


def get_school_detail(school_id: str) -> str:
    """Lấy thông tin chi tiết của một trường học dựa trên school_id."""
    host = "https://api-v2.smartapply.ca"
    agent_id = os.getenv("SMART_APPLY_AGENT_ID", "your_agent_id")
    token = os.getenv("SMART_APPLY_TOKEN", "your_token")
    url = f"{host}/api/open-application/{agent_id}/school/{school_id}"

    params = {"token": token}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        import json

        raw_result = response.json().get("result", {})
        formatted_response = {
            "statusCode": 200,
            "result": {
                "_id": raw_result.get("_id", ""),
                "logo": raw_result.get("logo", ""),
                "name": raw_result.get("name", ""),
                "category": raw_result.get("category", ""),
                "description": raw_result.get("description", ""),
                "address": raw_result.get(
                    "address", {"country": "", "city": "", "state": "", "street": ""}
                ),
                "content": raw_result.get("content", ""),
                "website": raw_result.get("website", ""),
                "banner": raw_result.get("banner", ""),
            },
        }
        return json.dumps(formatted_response, ensure_ascii=False)
    return "School not found or API error"


tool_get_school_detail_config = {
    "name": "get_school_detail",
    "description": "Lấy thông tin chi tiết của một trường học dựa trên school_id. Trả về logo, name, category, description, address, content, website, banner.",
    "func": get_school_detail,
}
