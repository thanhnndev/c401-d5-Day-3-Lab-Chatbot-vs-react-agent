# Báo cáo Cá nhân: Lab 3 - Chatbot vs ReAct Agent

- **Họ và tên sinh viên**: Trần Trọng Giang
- **Mã số sinh viên**: 2A202600316
- **Ngày thực hiện**: 2026-04-06

---

## I. Đóng góp kỹ thuật (Technical Contribution) (15 Điểm)

*Mô tả các đóng góp cụ thể do mình viết vào mã nguồn của dự án bài Lab.*

- **Các Module đã tự tay triển khai**: Code toàn bộ file `src/tools/smart_apply_tools.py` và bộ test tự động `src/tools/test_smart_apply_tools.py`.
- **Code Highlights**:
  Thay vì để LLM trả về raw JSON làm tràn Context Window và vượt token, tôi đã viết script rút gọn dữ liệu Observation cực kỳ hiệu quả:
  ```python
  # Trích từ get_school_programs
  if data.get("statusCode") == 200 and data.get("result"):
      for item in result_list:
          formatted_results.append(f"- Program ID: {item.get('_id')} | Name: {item.get('name')} | Intake: ...")
      return "\n".join(formatted_results)
  ```
- **Tài liệu hóa (Documentation)**:
  Tất cả các custom tools (Tool tra cứu và Tool Nộp hồ sơ API 6) đều được gắn docstrings cẩn thận để cung cấp bối cảnh (context) ép LLM hiểu đúng lúc nào thì nên gọi, lúc nào thì tuyệt đối không được gọi.

---

## II. Phân tích Case Study Debugging (10 Điểm)

*Phân tích một sự kiện lỗi (failure event) đã gặp phải và log lại trong quá trình mài giũa Agent.*

- **Mô tả sự cố**: Agent dính vòng lặp vô tận (infinite loop) khi nhận câu hỏi *"Tôi muốn nộp đơn vào Centennial College ngành Software Engineering"*. LLM liên tục sinh ra Action bao bọc trong thẻ markdown thay vì raw text, khiến Regex parser không bắt được, vòng lặp cứ chạy đến `max_steps`.
- **Nguồn Log** (`logs/2026-04-06.log`):
  ```json
  {"timestamp":"2026-04-06T10:12:46.001Z","event":"AGENT_START","data":{"input":"Tôi muốn nộp đơn vào Centennial College ngành Software Engineering","model":"gpt-4o-mini"}}
  {"timestamp":"2026-04-06T10:12:48.532Z","event":"LLM_RESPONSE","data":{"step":1,"thought":"Cần lấy danh sách ngành học trước khi nộp đơn.","action":"```json\nget_school_programs(school_name='Centennial College')\n```"}}
  {"timestamp":"2026-04-06T10:12:48.545Z","event":"PARSER_ERROR","data":{"step":1,"error":"Invalid Action Format — Regex failed to match 'Action: name(args)' due to markdown backticks wrapping the call."}}
  {"timestamp":"2026-04-06T10:12:51.120Z","event":"LLM_RESPONSE","data":{"step":2,"thought":"Lần trước thất bại, thử lại.","action":"```json\nget_school_programs(school_name='Centennial College')\n```"}}
  {"timestamp":"2026-04-06T10:12:51.134Z","event":"PARSER_ERROR","data":{"step":2,"error":"Invalid Action Format — same markdown backtick error repeated."}}
  {"timestamp":"2026-04-06T10:12:54.889Z","event":"AGENT_END","data":{"steps":5,"result":"MAX_STEPS_EXCEEDED","final_answer":null}}
  ```
- **Chẩn đoán nguyên nhân (Diagnosis)**: LLM (GPT-4o-mini) tự thêm cú pháp ` ```json ` bao quanh `Action` vì System Prompt v1 không dặn rõ định dạng. Mỗi `PARSER_ERROR` không được đưa vào context để LLM học sửa, nên cûng lỗi đó lặp lại đủ 5 vòng đến khi Agent tắt ngóm với `MAX_STEPS_EXCEEDED`.
- **Cách giải quyết (Solution)**: Cập nhật **System Prompt v2** bổ sung câu cứng *"Chỉ viết Action: tool_name(args) — KHÔNG dùng thẻ markdown, KHÔNG thêm backtick."* Đồng thời thêm `try/except` vào vòng lặp `agent.py`: khi bắt gặp `PARSER_ERROR`, agent tự tạo Observation phản hồi lỗi và đưa vào conversation history để LLM tiếp bước liền mà không tốn vòng lặp mù.

---

## III. Phân tích cá nhân: Chatbot thường vs ReAct Agent (10 Điểm)

*Sự khác biệt về khả năng tư duy và suy luận giữ 2 phiên bản LLM.*

1. **Khả năng suy luận (Reasoning)**: Nhờ có bước vòng lặp tạm nghỉ `Thought`, Agent không bao giờ nói dối hay "bịa" được thông tin (Hallucination) về các trường Đại học vốn dĩ không có trong hệ thống SmartApply như cái cách Chatbot thường hay làm. Agent buộc phải vác tool đi tra API rồi mới được đáp.
2. **Độ tin cậy (Reliability)**: Nghịch lý là với những câu chào hỏi (Chitchat) hoặc Q&A khái niệm, Agent lại hoạt động cấu trúc **tệ hơn** Chatbot. Vì nó liên tục ngập ngừng tạo Thought, rà soát Tool không cần thiết, làm tăng vọt độ trễ (Latency) so với Chatbot trả lời nháy mắt.
3. **Quan sát (Observation)**: Khi Agent đút tên ngành lạ vào `get_school_programs` và bị báo lỗi trả rỗng, Observation sẽ "chuông báo thức" gọi LLM tĩnh lại và phản hồi "Trường không dạy ngành này" thay vì cố sống cố chết chốt sale.

---

## IV. Cải tiến tương lai (Future Improvements) (5 Điểm)

*Kế hoạch scale-up biến Agent thành công cụ Production chạy thật.*

- **Khả năng mở rộng (Scalability)**: Lên phiên bản thật, cần dùng Vector Database để móc nối kỹ thuật (RAG), vì nếu trường học có lên tới hàng ngàn Tools khác nhau, mình nhét hết Tools vô Prompt sẽ gây tràn token, chi phí đắt đỏ. 
- **Tính an toàn (Safety)**: Đặc biệt với Tool `submit_student_application` (tác động tới Data học sinh), bắt buộc phải có bước chèn **Supervisor LLM** hoặc Human-in-the-loop (Nhân sự xác nhận tay) trước khi cho Agent gọi API bừa bãi.
- **Hiệu suất (Performance)**: Phải giảm độ trễ (Time-to-first-token). Cải tiến Streaming để chữ trả về giao diện người dùng trơn mượt dần thay vì phải đợi 20 giây cho cả 1 vòng lặp ReAct chạy ngầm mới phun kết quả.
