import os
import sys

# Add src to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.tools.smart_apply import get_country_list, search_schools

def test_smart_apply_tools():
    print("========================================")
    print("🚀 BẮT ĐẦU TEST CÁC TOOLS SMART APPLY")
    print("========================================\n")
    
    # Test 1: Hàm lấy danh sách quốc gia
    print("--- 1. Testing get_country_list() ---")
    countries = get_country_list()
    print("Result:")
    print(countries)
    print("-" * 40)

    # Test 2: Tìm kiếm trường học (Lọc theo quốc gia Canada)
    print("\n--- 2. Testing search_schools(country='Canada') ---")
    canada_schools = search_schools(country="Canada")
    print("Result:")
    print(canada_schools)
    print("-" * 40)
    
    # Test 3: Tìm kiếm trường học (Lọc theo keyword)
    print("\n--- 3. Testing search_schools(search='College') ---")
    college_schools = search_schools(search="College")
    print("Result:")
    print(college_schools)
    print("-" * 40)
    
    # Test 4: Tìm kiếm kết hợp
    print("\n--- 4. Testing search_schools(country='United States', search='University') ---")
    combo_schools = search_schools(country="United States", search="University")
    print("Result:")
    print(combo_schools)
    print("========================================")

if __name__ == "__main__":
    test_smart_apply_tools()
