import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.tools.get_school_detail import get_school_detail

def test_get_school_detail():
    load_dotenv()
    
    # Một school_id mẫu mà tôi đã lấy được từ lần test API trước
    test_school_id = "651f7d57e8bdb030a6ff6a66"
    
    print("-" * 50)
    print("KẾT QUẢ TOOL XEM CHI TIẾT TRƯỜNG HỌC")
    print("-" * 50)
    detail_res = get_school_detail(test_school_id)
    print(detail_res)

if __name__ == "__main__":
    test_get_school_detail()
