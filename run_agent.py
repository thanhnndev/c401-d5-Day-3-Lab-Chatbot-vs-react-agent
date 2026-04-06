import os
from dotenv import load_dotenv

# Load các biến môi trường từ file .env
load_dotenv()

from src.core.gemini_provider import GeminiProvider
from src.agent.agent import ReActAgent
from src.tools.smart_apply import (
    tool_get_country_list_config,
    tool_search_schools_config,
)
from src.tools.get_school_detail import tool_get_school_detail_config
from src.tools.get_programs import tool_get_programs_config
from src.tools.smart_apply_tools import (
    tool_get_program_detail_config,
    tool_submit_application_config,
)


def main():
    # 1. Khởi tạo LLM Provider sử dụng Gemini
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        print("Lỗi: Không tìm thấy GEMINI_API_KEY trong file .env")
        return

    # 2. Kiểm tra SmartApply credentials
    if not os.getenv("SMART_APPLY_AGENT_ID") or not os.getenv("SMART_APPLY_TOKEN"):
        print(
            "Lỗi: SMART_APPLY_AGENT_ID và SMART_APPLY_TOKEN phải được set trong file .env"
        )
        return

    # Sử dụng model gemini-1.5-flash (có thể đổi sang flash-8b hoặc pro nếu muốn)
    # GeminiProvider(model_name, api_key) -> theo file src/core/gemini_provider.py
    llm = GeminiProvider(model_name="gemini-2.5-flash", api_key=gemini_api_key)

    # 2. Khai báo danh sách các tools
    tools = [tool_get_country_list_config, tool_search_schools_config]

    # 3. Khởi tạo Agent
    agent = ReActAgent(llm=llm, tools=tools, max_steps=5)

    # 4. Chạy vòng lặp test agent
    print("🤖 Agent đã sẵn sàng. Gõ 'exit' hoặc 'quit' để thoát.\n")
    while True:
        try:
            user_input = input("User >> ")
            if user_input.lower() in ["exit", "quit"]:
                break

            print("\n⏳ Đang suy nghĩ...\n")
            result = agent.run(user_input)

            print(f"\nFinal Result:\n{result}\n")
            print("-" * 50 + "\n")
        except KeyboardInterrupt:
            break
        except Exception as e:
            print(f"Có lỗi xảy ra: {e}")


if __name__ == "__main__":
    main()
