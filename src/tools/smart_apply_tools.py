import os
import requests
from typing import Optional

# Lấy cấu hình từ .env hoặc sử dụng mặc định từ API Key bạn cung cấp
AGENT_ID = os.getenv("SMART_APPLY_AGENT_ID", "69ca437e82d037b8fcf136c0")
TOKEN = os.getenv("SMART_APPLY_TOKEN", "69ca439f9ffadfa2c498fe2d")
BASE_URL = "https://api-v2.smartapply.ca"

def get_school_programs(school_id: str, search: str = "", page: int = 1) -> str:
    """
    Tool 4: Lấy danh sách chuyên ngành học (Get Program list) của một trường cụ thể.
    """
    url = f"{BASE_URL}/api/open-application/{AGENT_ID}/school/{school_id}/program"
    params = {
        "token": TOKEN,
        "page": page
    }
    if search:
        params["search"] = search
        
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        # Format dữ liệu trả về cho LLM dễ đọc (tránh quăng raw JSON quá dài có thể gây rối)
        if data.get("statusCode") == 200 and data.get("result"):
            result_list = data["result"]
            formatted_results = []
            for item in result_list:
                formatted_results.append(
                    f"- Program ID: {item.get('_id')} | Name: {item.get('name')} | Intake: {', '.join(item.get('intake', []))}"
                )
            return "\n".join(formatted_results)
        return "Không tìm thấy chương trình học nào phù hợp cho trường này."
    except Exception as e:
        return f"Function Call Error - get_school_programs: {str(e)}"

def get_program_detail(program_id: str) -> str:
    """
    Tool 5: Xem thông tin chi tiết của một chương trình học.
    """
    url = f"{BASE_URL}/api/open-application/{AGENT_ID}/program/{program_id}"
    params = {
        "token": TOKEN
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data.get("statusCode") == 200 and data.get("result"):
            item = data["result"]
            
            # Format trả về chi tiết dạng Text
            return (
                f"Program ID: {item.get('_id')}\n"
                f"Program Name: {item.get('name')}\n"
                f"Intakes: {', '.join(item.get('intake', []))}\n"
            )
        return "Không tìm thấy thông tin chi tiết cho chương trình học này."
    except Exception as e:
        return f"Function Call Error - get_program_detail: {str(e)}"

def submit_student_application(student_name: str, student_email: str, student_phone: str, program_id: str,
                               country: str = "Viet Nam", city: str = "", passport: str = "", birthday: str = "") -> str:
    """
    Tool 6: Gửi hồ sơ đăng ký (Submit application) nhập học cho học viên.
    """
    url = f"{BASE_URL}/api/open-application/{AGENT_ID}/application"
    
    # Payload theo đúng chuẩn JSON body của SmartApply
    payload = {
        "token": TOKEN,
        "student_info": {
            "name": student_name,
            "email": student_email,
            "phone": student_phone,
            "address": {
                "country": country,
                "city": city,
                "state": "",
                "street": ""
            },
            "passport": passport,
            "birthday": birthday,
            "student_id": "",
            "code": ""
        },
        "parent_info": {
            "name": "",
            "phone": "",
            "email": ""
        },
        "intake": [],
        "program": program_id,
        "student_notification": False # False để tránh spam email học sinh khi test
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        data = response.json()
        
        if data.get("statusCode") == 200 and data.get("result"):
            res = data["result"]
            return f"Thành công đăng ký hồ sơ! Mã hồ sơ (Application ID): {res.get('_id')}"
        return "Gửi hồ sơ thất bại: Server không trả về OK 200."
    except Exception as e:
        return f"Function Call Error - submit_student_application: {str(e)}"
