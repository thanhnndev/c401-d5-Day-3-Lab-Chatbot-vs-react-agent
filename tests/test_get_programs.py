import os
import sys
from dotenv import load_dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.tools.get_programs import get_programs

def test_get_programs():
    load_dotenv()
    
    # Một school_id mẫu mà tôi đã lấy được từ lần test API trước
    test_school_id = "651f7d57e8bdb030a6ff6a66"
    
    print("-" * 50)
    print("KẾT QUẢ TOOL LẤY DANH SÁCH CHƯƠNG TRÌNH HỌC (Ví dụ với từ khóa 'Data')")
    print("-" * 50)
    program_res = get_programs(test_school_id, search_query="Data")
    print(program_res)

if __name__ == "__main__":
    test_get_programs()
