import requests
import os

# Lấy cấu hình từ biến môi trường
AGENT_ID = os.getenv("SMART_APPLY_AGENT_ID")
TOKEN = os.getenv("SMART_APPLY_TOKEN")
BASE_URL = "https://api-v2.smartapply.ca"

if not AGENT_ID or not TOKEN:
    raise ValueError(
        "SMART_APPLY_AGENT_ID and SMART_APPLY_TOKEN must be set in .env file"
    )


def get_country_list() -> str:
    """
    Tool 1: Lấy danh sách quốc gia (Get Country list)
    Thực hiện gọi API GET /api/zone/country
    """
    url = f"{BASE_URL}/api/zone/country"
    try:
        # API không yêu cầu AgentID và Token cho endpoint này theo tài liệu
        response = requests.get(url, headers={"accept": "application/json"})
        response.raise_for_status()
        data = response.json()

        # Parse kết quả để format lại cho Agent dễ hiểu
        if data.get("statusCode") == 200:
            countries = data.get("result", [])
            if not countries:
                return "Không tìm thấy danh sách quốc gia."

            # Lấy ra tên các quốc gia
            country_names = [
                country.get("name") for country in countries if "name" in country
            ]
            return "Danh sách quốc gia hỗ trợ: " + ", ".join(country_names)
        else:
            return f"Lỗi từ API: {data}"

    except Exception as e:
        return f"Lỗi khi thực thi tool get_country_list: {str(e)}"


# Định nghĩa dictionary của Tool 1 để truyền vào Agent
tool_get_country_list_config = {
    "name": "get_country_list",
    "description": "Dùng để lấy danh sách các quốc gia mà hệ thống có hỗ trợ tư vấn du học. Trả về tên các quốc gia.",
    "func": get_country_list,
}


def search_schools(country: str = None, search: str = None) -> str:
    """
    Tool 2: Tìm kiếm trường học
    Thực hiện gọi API GET /api/open-application/{agentID}/school?token={token}
    """
    if not country:
        # Defaults to empty filter if no country specified
        country_param = ""
    else:
        country_param = country

    url = f"{BASE_URL}/api/open-application/{AGENT_ID}/school"
    params = {"token": TOKEN, "page": 1, "country": country_param}
    if search:
        params["search"] = search

    try:
        response = requests.get(
            url, params=params, headers={"accept": "application/json"}
        )
        response.raise_for_status()
        data = response.json()

        if data.get("statusCode") == 200:
            schools = data.get("result", [])
            if not schools:
                return f"Không tìm thấy trường nào ở quốc gia '{country}' hoặc với từ khóa này."

            # Formatting results
            school_info = []
            for s in schools[:10]:  # Limit to top 10 to not overflow prompt
                name = s.get("name", "Unknown School")
                cat = s.get("category", "")
                addr = s.get("address", {})
                city = addr.get("city", "")
                school_info.append(f"- {name} (Category: {cat}, City: {city})")

            summary = "\n".join(school_info)
            if len(schools) > 10:
                summary += f"\n... và {len(schools) - 10} trường khác."
            return summary
        else:
            return f"Lỗi từ API tìm kiếm trường: {data}"
    except Exception as e:
        return f"Lỗi khi thực thi tool search_schools: {str(e)}"


# Định nghĩa Tool 2
tool_search_schools_config = {
    "name": "search_schools",
    "description": "Tìm kiếm các trường học tại một quốc gia (country) và có thể kèm từ khóa (search). Ví dụ: Action: search_schools(country='Canada', search='College')",
    "func": search_schools,
}
