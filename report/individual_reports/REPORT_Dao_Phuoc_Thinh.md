# Individual Report: Lab 3 - Chatbot vs ReAct Agent

- **Student Name**: Đào Phước Thịnh
- **Student ID**: 2A202600029
- **Date**: 2026-04-06

---

## I. Technical Contribution (15 Points)

*Describe your specific contribution to the codebase (e.g., implemented a specific tool, fixed the parser, etc.).*

- **Modules Implementated**: 
    - `src/chatbot_base.py`: Xây dựng chatbot cơ bản có khả năng duy trì ngữ cảnh qua `history`.
    - Phân tích và đối chiếu luồng thực thi trong `src/agent/agent.py`.
- **Code Highlights**:
  ```python
  # Quản lý bộ nhớ ngắn hạn trong Chatbot
  self.history.append((user_input.strip(), full_response.strip()))
  if len(self.history) > self.max_history:
      self.history.pop(0)
  ```
- **Documentation**: Tôi đã phát triển nền tảng `UniversityConsultantBot` để làm baseline. Thông qua baseline này, ta nhận thấy Chatbot truyền thống chỉ phụ thuộc vào trọng số (knowledge) đã được huấn luyện sẵn, nên không thể cập nhật dữ liệu mới. Trái ngược lại, `ReActAgent` trong `agent.py` được thiết kế vòng lặp `Thought-Action-Observation`, cho phép nó dừng sinh text giữa chừng để gọi hàm (`_execute_tool`) và lấy dữ liệu môi trường, từ đó đưa ra câu trả lời dựa trên thông tin thực tế.

---

## II. Debugging Case Study (10 Points)

*Analyze a specific failure event you encountered during the lab using the logging system.*

- **Problem Description**: Sự cố "Ảo giác liên tục" (Hallucination) ở Chatbot cơ bản và "Infinite Loop" (Vòng lặp vô hạn) khi Agent gọi tool bị lỗi.
- **Log Source**: Terminal output & Event Logs `AGENT_START / AGENT_END`.
- **Diagnosis**: 
   - Với `chatbot_base.py`, do không có khả năng dùng tool để tra cứu, mô hình tự bịa ra thông tin tuyển sinh của trường đại học không chính xác (dùng kiến thức cũ).
   - Khi chuyển sang `agent.py`, ban đầu Agent sinh ra `Action: tool_name()` nhưng bị sai argument. Hàm `_execute_tool` trả về lỗi. Tuy nhiên, Agent không hiểu lỗi này và sinh ra Thought y hệt rồi gọi tool y hệt, dẫn đến kịch kim `max_steps` mà không giải quyết được bài toán.
- **Solution**:
    1. Thiết lập lại System Prompt cho Agent, nhắc nhở cụ thể: *"Nếu gặp Observation báo lỗi, hãy suy nghĩ cách đổi tham số hoặc đổi tool khác, tuyệt đối không lặp lại Action cũ."*
    2. Ở hàm `_execute_tool`, thay vì báo lỗi hệ thống chung chung, tôi điều chỉnh thông báo lỗi thành gợi ý: *"Error_executing_tool: Tham số không hợp lệ. Hãy kiểm tra lại mô tả của tool"* nhằm ép LLM nhận thức rõ Observation.

---

## III. Personal Insights: Chatbot vs ReAct (10 Points)

*Reflect on the reasoning capability difference.*

Qua việc trực tiếp đối chiếu `chatbot_base.py` (Base LLM) và `agent.py` (ReAct LLM), tôi rút ra những khác biệt cốt lõi:

1.  **Reasoning vs Generation**: Chatbot sinh ra câu trả lời cuối cùng (Final Answer) ngay lập tức dựa trên pattern-matching và tham số weight. ReAct Agent bị "ép" phải bước vào khối `Thought` trước, phân rã vấn đề ("Tôi cần tìm trường A, sau đó xem học phí"), giúp LLM suy luận mạch lạc hơn rất nhiều.
2.  **Khả năng Cập nhật Data (Grounded vs Trained)**: Đây là điểm khác biệt lớn nhất. Chatbot dùng kiến thức bị đóng băng (train-time knowledge). ReAct Agent sử dụng `Action` để gọi Tool, từ đó lấy `Observation` (ví dụ data từ database thời gian thực). Do vậy, Agent có độ xác thực (factuality) cao hơn, giải quyết triệt để vấn đề Hallucination.
3.  **Reliability & Latency**: Chatbot nhanh và ổn định đối với câu hỏi chitchat. Agent tuy thông minh nhưng chậm hơn vì phải thực hiện cycle (Thought->Action, đợi Response từ tool->Observation). Hơn nữa, nếu parser của Regex (`re.search(r"Action:\s*(\w+)")`) bị lỗi, Agent có thể "chết" dọc đường.

---

## IV. Future Improvements (5 Points)

*How would you scale this for a production-level AI agent system?*

Để biến `ReActAgent` trong `agent.py` từ mức lab lên một hệ thống production-level, tôi đề xuất:

- **Bảo mật và An toàn (Safety)**: Trong `agent.py` hiện đang dùng `eval()` để gọi hàm linh hoạt với arguments. Việc này tạo lỗ hổng bảo mật cực lớn (Prompt Injection). Cần thay thế bằng cơ chế `Function Calling` chuẩn của OpenAI / Gemini API hoặc dùng Pydantic Validations để parse args an toàn.
- **Hiệu suất & Truy xuất (Performance - RAG)**: Tích hợp hệ thống Retrieval-Augmented Generation (Vector DB) như một Tool độc lập. Khi người dùng hỏi khối lượng kiến thức khổng lồ về tuyển sinh, Agent sẽ dùng Tool `SearchVectorDB` để fetch ra chunk phù hợp nhất lên prompt thay vì lưu tất cả vào System Prompt.
- **Scalability (Multi-agent)**: Khi hệ thống có hàng chục tools (Search, Booking, Calculate), context window sẽ bị tràn. Cần xây dựng Router / Supervisor Agent làm nhiệm vụ phân loại intent, sau đó truyền luồng xử lý xuống các Sub-Agent chuyên biệt nhằm tối ưu hóa và giảm rủi ro nghẽn cổ chai.
