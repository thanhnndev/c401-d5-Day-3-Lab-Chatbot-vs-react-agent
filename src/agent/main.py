from src.tools.get_school_detail import get_school_detail
from src.tools.get_programs import get_programs

tools_definition = [
    {
        "name": "get_school_detail",
        "func": get_school_detail,
        "description": "Lấy thông tin chi tiết (logo, địa chỉ, website,...) của một trường học cụ thể.",
        "parameters": "school_id. Ví dụ: '651f7d57e8bdb030a6ff8a19'"
    },
    {
        "name": "get_programs",
        "func": get_programs,
        "description": "Lấy danh sách các ngành học của một trường học thông qua school_id. Có thể tìm kiếm ngành cụ thể bằng search_query.",
        "parameters": "school_id, search_query (tùy chọn). Ví dụ: '651f7d57e8bdb030a6ff8a19', 'Computer Science' hoặc '651...19', ''"
    }
]
