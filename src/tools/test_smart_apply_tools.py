import os
import sys

# Bổ sung root path để Python hiểu cấu trúc src module
# Cho tiết code có thể chạy ở bất kỳ đâu trong thư mục
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from src.tools.smart_apply_tools import get_school_programs, get_program_detail, submit_student_application

def run_tests():
    print("="*60)
    print("🧪 BẮT ĐẦU CHẠY TEST: SMART APPLY API TOOLS 🧪")
    print("="*60)

    # Đây là mã ID (School ID) của một trường có thật: Thompson Rivers University
    test_school_id = "651f7d57e8bdb030a6ff6a66"
    test_program_id = "" # Biến cất giữ ID để chạy test số 2
    
    # ========================================================
    # TEST 1: Tool get_school_programs
    # ========================================================
    print(f"\n[TEST 1] Đang nạp dữ liệu từ: get_school_programs(school_id='{test_school_id}')")
    print("-" * 50)
    
    programs_result = get_school_programs(school_id=test_school_id)
    print("KẾT QUẢ QUAN SÁT (OBSERVATION):")
    print(programs_result)

    # Tách chuỗi lấy ra Program ID đầu tiên nếu có kết quả để thực hiện Test 2
    if "Program ID: " in programs_result:
        first_line = programs_result.split("\n")[0]
        test_program_id = first_line.split("Program ID: ")[1].split(" | ")[0]
        print(f"\n[INFO] Auto-extracted một Program ID hợp lệ để làm test 2: {test_program_id}")
    else:
        print("\n[CẢNH BÁO] Không lấy được mảng program nào, ngưng test số 2.")


    # ========================================================
    # TEST 2: Tool get_program_detail
    # ========================================================
    if test_program_id:
        print(f"\n[TEST 2] Đang nạp dữ liệu chi tiết từ: get_program_detail(program_id='{test_program_id}')")
        print("-" * 50)
        
        detail_result = get_program_detail(program_id=test_program_id)
        print("KẾT QUẢ QUAN SÁT (OBSERVATION):")
        print(detail_result)

    # ========================================================
    # TEST 3: Tool submit_student_application
    # ========================================================
    if test_program_id:
        print(f"\n[TEST 3] Đang gửi hồ sơ test (POST) tới: submit_student_application(program_id='{test_program_id}')")
        print("-" * 50)
        
        submit_result = submit_student_application(
            student_name="Test Student AI",
            student_email="test.ai@example.com",
            student_phone="0123456789",
            program_id=test_program_id,
            country="Viet Nam",
            city="Ho Chi Minh"
        )
        print("KẾT QUẢ QUAN SÁT (OBSERVATION):")
        print(submit_result)
        
    print("\n" + "="*60)
    print("🏆 HOÀN THÀNH QUÁ TRÌNH TEST! 🏆")
    print("="*60)

if __name__ == "__main__":
    run_tests()
