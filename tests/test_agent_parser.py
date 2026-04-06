import os
import sys

# Add src to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.agent.agent import ReActAgent
from src.tools.smart_apply import tool_get_country_list_config, tool_search_schools_config

# Tạo 1 thẻ MockLLM giả tạo ra text cố định
class MockLLM:
    def __init__(self, mocked_text):
        self.mocked_text = mocked_text
        self.model_name = "mock-llm"
        
    def generate(self, prompt, system_prompt=None):
        return {"content": self.mocked_text, "usage": {}, "latency_ms": 0}

def test_agent_parser_action_1():
    print("\n--- Test 1: Agent gọi Tool get_country_list() ---")
    mock_response = '''
Thought: Người dùng muốn biết các quốc gia.
Action: get_country_list()
    '''
    mock_llm = MockLLM(mock_response)
    agent = ReActAgent(llm=mock_llm, tools=[tool_get_country_list_config], max_steps=1)
    
    # Bước này Agent sẽ nhận mock_response => chạy _execute_tool("get_country_list", "")
    agent.run("Liệt kê các quốc gia")

def test_agent_parser_action_2():
    print("\n--- Test 2: Agent gọi Tool search_schools(country='Canada') ---")
    mock_response = '''
Thought: Người dùng muốn tìm trường ở Canada.
Action: search_schools(country='Canada')
    '''
    mock_llm = MockLLM(mock_response)
    agent = ReActAgent(llm=mock_llm, tools=[tool_search_schools_config], max_steps=1)
    
    # Bước này Agent sẽ bóc tách chuỗi country='Canada' và gọi vào hàm
    agent.run("Tìm trường ở Canada")

def test_agent_parser_final_answer():
    print("\n--- Test 3: Agent xuất Final Answer ---")
    mock_response = '''
Thought: Đã có đủ thông tin để trả lời cho người dùng.
Final Answer: Hệ thống hỗ trợ tư vấn du học tại Canada với 10 trường học khác nhau.
    '''
    mock_llm = MockLLM(mock_response)
    agent = ReActAgent(llm=mock_llm, tools=[], max_steps=1)
    
    result = agent.run("Cho tôi thông tin cuối cùng?")
    print("Agent Return Value:", result)

if __name__ == "__main__":
    print("========================================")
    print("⚙️ TEST LOGIC PARSER CỦA REACT AGENT")
    print("========================================")
    test_agent_parser_action_1()
    test_agent_parser_action_2()
    test_agent_parser_final_answer()
