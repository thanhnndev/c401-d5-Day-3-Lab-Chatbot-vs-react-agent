# Individual Report: Lab 3 - Chatbot vs ReAct Agent

- **Student Name**: Đào Văn Công
- **Student ID**: 2A202600031
- **Date**: 06/04/2026

---

## I. Technical Contribution (15 Points)

*Describe your specific contribution to the codebase (e.g., implemented a specific tool, fixed the parser, etc.).*

- **Modules Implemented**: Tách monolithic file thành hệ thống file độc lập `src/tools/get_school_detail.py`, `src/tools/get_programs.py`. Cập nhật `src/agent/agent.py` và `src/agent/run_agent.py` để tích hợp hoàn chỉnh.
- **Code Highlights**:
Thay vì trả về đối tượng thập cẩm làm tốn token của Agent, tôi đã cấu trúc lại JSON Parser cho tool để chỉ lọc ra những key quan trọng khớp với API Spec. 

```python
# Trích đoạn src/tools/get_school_detail.py (Đã được rewrite)
def get_school_detail(school_id: str) -> str:
    host = "https://api-v2.smartapply.ca"
    url = f"{host}/api/open-application/{os.getenv('SMART_APPLY_AGENT_ID')}/school/{school_id}"
    params = {"token": os.getenv("SMART_APPLY_TOKEN")}
    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        raw_result = response.json().get("result", {})
        formatted_response = {
            "statusCode": 200,
            "result": {
                "_id": raw_result.get("_id", ""),
                "logo": raw_result.get("logo", ""),
                "name": raw_result.get("name", ""),
                "category": raw_result.get("category", "")
                # ... Lọc bỏ các key rác, chỉ giữ lại các fields cần thiết
            }
        }
        return json.dumps(formatted_response, ensure_ascii=False)
    return "School not found or API error"
```

- **Documentation**: Bằng cách chắt lọc JSON output, kết quả trở thành một "Observation" tinh gọn. LLM có thể dễ dàng hiểu được các trường thông tin mà không bị tràn Context Window hoặc bị lẫn lộn bởi hàng chục parameters phụ (email, old_id, form) trả về từ database thực tế.

---

## II. Debugging Case Study (10 Points)

*Analyze a specific failure event you encountered during the lab using the logging system.*

- **Problem Description**: Sau khi qua các bước Thought -> Action -> Observation trơn tru để lấy dữ liệu, Agent bất ngờ bị văng câu lệnh báo lỗi `Failure: Can not analyze Agent's actions.` ngay tại Step cuối cùng thay vì in ra đáp án cho User.
- **Log Source**: (Trích từ quá trình debug thực tế trong `logs/2026-04-06.log`)
```json
...
{"timestamp": "2026-04-06T09:10:12.562109", "event": "TOOL_CALL", "data": {"tool": "get_programs", "args": "'651f7d57e8bdb030a6ff6a66', 'Data'"}}
{"timestamp": "2026-04-06T09:10:15.764486", "event": "LLM_METRIC", "data": {"provider": "openai", "model": "gpt-4o", "prompt_tokens": 3442, "completion_tokens": 259, "total_tokens": 3701, "latency_ms": 2625, "cost_estimate": 0.03701}}
{"timestamp": "2026-04-06T09:11:57.332759", "event": "AGENT_START", "data": {"input": "Tôi có ID ngôi trường là...", "model": "gpt-4o"}}
```
- **Diagnosis**: Agent gặp sự cố khi cố tạo format chuẩn `Final Answer:`. Tuy LLM đã tìm ra được câu trả lời ở sau sự kiện `TOOL_CALL` cuối cùng (như log trên), nhưng vì LLM quên chèn tiền tố `"Final Answer:"`, bộ Regex `Action:\s*(\w+)\((.*)\)` trong vòng lặp ReAct của `agent.py` không thể match được do nó không phải là hàm Action. Logic code gặp bế tắc và ném ra "Failure".
- **Solution**: Đã fix lại luồng Fallback parser tại `src/agent/agent.py`. Nếu regex không bắt được pattern Action và không có Final Answer, thay vì báo lỗi Failure, nó sẽ tự động châm chước trả về `content` nguyên bản (như một chatbot) kèm theo việc ghi thẻ log event `success_with_fallback`, từ đó giảm tỷ lệ đứt gãy giữa chừng.

---

## III. Personal Insights: Chatbot vs ReAct (10 Points)

*Reflect on the reasoning capability difference.*

1.  **Reasoning**: ReAct vượt trội hươn vì Chatbot thông thường hay bị ảo giác (Hallucinate) ra câu trả lời dựa trên lượng thông tin hạn hẹp; LLM trong mô hình ReAct phân tác công việc qua `Thought`. Ví dụ: Từ một ID, nó ý thức được cần dùng Tool rút Data trường, sau đó lại dùng tiếp Tool khác trích mảng ngành học khớp từ khoá.
2.  **Reliability**: Điểm hạn chế là độ trễ. Agent phải thực hiện 2-3 đợt API call nối tiếp qua lại (lên đến xấp xỉ >3000ms như ở log), thay vì trả kết quả ngay tức khắc. Mảng Prompt Token cũng liên tục phình to qua mỗi Step (từ 331 -> 3301 -> 3701 tokens), rất tốn kém chi phí nếu lạm dụng.
3.  **Observation**: Observation là môi giới trung gian quan trọng nhất. Code tool thực thi càng sạch, chuỗi JSON trả ra cho Observation càng thuần túy thì LLM càng định vị được thông tin mình cần nhanh chóng mà không bị nhầm ngữ cảnh.

---

## IV. Future Improvements (5 Points)

*How would you scale this for a production-level AI agent system?*

- **Scalability**: Thay vì ReAct cổ điển gán toàn bộ tools vào 1 prompt nặng nề, ta tối ưu bằng **Multi-Agent Framework** (như AutoGen/LangGraph), chia ra chuyên viên Agent Education Search và Agent Counseling hoạt động đồng thời. Sử dụng RAG Pipeline để pre-fetch bớt data thay vì tra cứu API thủ công.
- **Safety**: cấu hình Rate-Limiting và Timeout tại các file tools để Agent không dính vào vòng lặp `Thought -> Error -> Thought` gây lãng phí token và DDOS hệ thống.
- **Performance**: Xây dựng Cache Middleware với Redis, tự động lưu output của `get_school_detail` trong 24h để Agent không phải request đi request lại trường dữ liệu tĩnh này mỗi lần hỏi về ngành học. Trích xuất Metrics Log ra Grafana để vẽ biểu đồ theo dõi ngân sách (Cost Estimate) real-time.
