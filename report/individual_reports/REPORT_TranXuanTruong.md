# Individual Report: Lab 3 - Chatbot vs ReAct Agent

- **Student Name**: Tran Xuan Truong 
- **Student ID**: 2A202600321
- **Date**: 2026-04-06

---

## I. Technical Contribution (15 Points)
- **Modules Implementated**: 
  - `src/tools/smart_apply.py`: Viết 2 functions kết nối SmartApply API (`get_country_list` và `search_schools`).
  - `src/agent/agent.py`: Hoàn thiện vòng lặp luồng ReAct (Thought-Action-Observation), xử lý Regex và `_execute_tool` động.
  - `run_agent.py`: File chạy chính, kết nối `ReActAgent` với hệ thống `GeminiProvider`.
  - `tests/test_tools.py` & `tests/test_agent_parser.py`: Xây dựng các kịch bản Mock test để tránh phụ thuộc LLM.
- **Code Highlights**: 
  - Sử dụng Regex `match = re.search(r"Action:\s*(\w+)(?:\((.*?)\))?", text)` để bóc tách tham số của Tool.
  - Sử dụng `eval(code_to_eval, {"__builtins__": None}, safe_locals)` truyền dữ liệu tham số động cho lệnh gọi thay vì fix cứng.
- **Documentation**: Mạch code luân chuyển linh hoạt giữa Prompt string, gọi hàm lấy data (API 1, API 2) và Feed input (Observation) ngược lại để LLM phân tích ra `Final Answer`.

---

## II. Debugging Case Study (10 Points)

*Analyze a specific failure event you encountered during the lab using the logging system.*

- **Problem Description**: Gặp lỗi giới hạn Rate Limit của Google Gemini API (`429 You exceeded your current quota...`).
- **Log Source**: Output trên terminal (Exception trace) khi đang test flow Chatbot với file `run_agent.py`.
- **Diagnosis**: Giới hạn Free Tier của các model `gemini-1.5-flash` và `gemini-2.5-flash` quá nhỏ gọn so với nhu cầu liên tục suy luận nhiều luồng ReAct (một câu hỏi LLM nội suy 2 - 3 step Action).
- **Solution**: Nâng cấp tư duy Test bằng cách tách lớp (Decoupling). Tự build `tests/test_tools.py` gọi API chay và `tests/test_agent_parser.py` dùng chuỗi text tĩnh giả (MockLLM) để test độc lập logic parse Regex của Agent mà không lãng phí Credits nào. 

---

## III. Personal Insights: Chatbot vs ReAct (10 Points)

*Reflect on the reasoning capability difference.*

1.  **Reasoning**: ReAct vượt trội hoàn toàn về mặt lý trí/logical. Thay vì lấy dữ liệu từ knowledge cũ rỗng, luồng `Thought` bắt LLM lùi lại phân tích "Tôi đang có trong tay Tool gì?" trước. Từ đó, Agent gọi `get_country_list` hoặc `search_schools("Canada")` một cách chính xác dựa theo từng nhu cầu user.
2.  **Reliability**: Trong các câu hỏi Trivia/Chit-chat đơn giản, Agent tệ và chậm hơn Chatbot vì nó mang quá nhiều Prompt system phía sau để parse. ReAct Agent cũng rất dễ sụp đổ nếu Regex format Output bị sai rớt chỉ một dấu phẩy hoặc format lệnh gọi hàm (SyntaxError).
3.  **Observation**: Observation là chìa khoá sửa sai (self-correction). Nếu `eval()` gặp lỗi, chuỗi thông báo lỗi ném qua `Observation` vào loop tiếp theo cho phép LLM nhận ra lỗi cú pháp và tự tạo ra `Thought` để viết lại lệnh chuẩn xác hơn.

---

## IV. Future Improvements (5 Points)

*How would you scale this for a production-level AI agent system?*

- **Scalability**: Dọn dẹp Parser dựa trên Regex và hệ lệnh `eval()` Python lỏng lẻo. Áp dụng chuẩn **Native Function Calling** (VD: Gemini/OpenAI tool call models) truyền trực tiếp các params dạng JSON Schema/Zod.
- **Safety**: Xoá lệnh `eval` để đảm bảo RCE Security. 
- **Performance**: Xử lý gọi `search_schools` và network calls sang Async/Await, cùng lúc LLM có thể gọi song song Parallel Multi-tools thay vì loop tuần tự.

---

> [!NOTE]
> Báo cáo của Tran Xuan Truong.
