# Individual Report: Lab 3 - Chatbot vs ReAct Agent

- **Student Name**: Nguyễn Trí Nhân
- **Student ID**: 2A202600224
- **Date**: 2026-04-06

---

## I. Technical Contribution (15 Points)

*Describe your specific contribution to the codebase (e.g., implemented a specific tool, fixed the parser, etc.).*

- **Modules Implementated**: `src/frontend/app.py` (hoặc các UI component hiển thị hội thoại)
- **Code Highlights**: 
  - Khởi tạo và thiết kế giao diện Chatbot cơ bản, kết nối phía người dùng cuối với backend. 
  - Đảm bảo hiển thị Markdown chính xác từ đoạn text trả về của Agent và quản lý luồng hội thoại (chat history state) phía client.
  - Xử lý trạng thái Loading: Khi gửi yêu cầu xuống hệ thống luồng ReAct Agent ngốn nhiều thời gian, em cấu hình thanh trạng thái tự chuyển sang chế độ tiến trình (spinner) để tạm thời phản hồi cho người dùng biết là yêu cầu đang được xử lý.
- **Documentation**: Hiện tại phiên bản frontend chỉ bóc tách kết quả dạng chuỗi cuối cùng (Final Answer) để in lên màn hình, đóng vai trò như một môi trường để đối chiếu giữa tốc độ trả lời của Baseline Chatbot và ReAct Agent.

---

## II. Debugging Case Study (10 Points)

*Analyze a specific failure event you encountered during the lab using the logging system.*

- **Problem Description**: Giao diện UI gặp tình trạng bị "treo" (hang), hiển thị biểu tượng loading nhưng sau đó crash trắng trang hoặc báo lỗi `Network Timeout` khi Agent phải gọi quá nhiều nhịp Tool ở Backend.
- **Log Source**: Ở console trình duyệt hoặc terminal frontend báo `FetchError: Network timeout at URL...` trong khi log ở Backend Server vẫn đang chạy tiếp các vòng lặp Thought -> Action.
- **Diagnosis**: Vì Backend xử lý đồng bộ và mô hình Agent đi qua vòng lặp tìm kiếm quá dài, thời gian phản hồi vượt quá ngưỡng giới hạn timeout mặc định của thư viện gọi API ở Frontend (ví dụ 30 giây). Kết nối HTTP bị đứt phía client nhưng backend không biết.
- **Solution**: 
  1. Thay đổi cấu hình Timeout của API Client ở phía Frontend (ví dụ thiết lập timeout từ 30s lên 120s). 
  2. Bọc `try/catch` ở phía UI để nếu quá thời gian gọi API hay đứt gãy giữa chừng, sẽ hiển thị một khối Alert *"Hệ thống mất quá nhiều thời gian để suy nghĩ, vui lòng thử lại"* thay vì làm sập trang.

---

## III. Personal Insights: Chatbot vs ReAct (10 Points)

*Reflect on the reasoning capability difference.*

1.  **Reasoning**: Đứng từ góc độ lập trình giao diện do chưa tách bóc được các khối chuỗi nội bộ như `Thought` trong Frontend, bản thân Agent đôi lúc nhìn giống như một cái "hộp đen" cực kỳ chậm (cho đến khi in ra đáp án). Việc mất đi cái nhìn "AI Explainability" này cho em thấy rằng: cho dù Agent có tư duy Logic (Reasoning) xuất sắc bao nhiêu ở phía dưới, thì nếu UI không show ra được quá trình đó, với user cuối cùng Agent chả khác gì Chatbot thường bị lag.
2.  **Reliability**: Người dùng thường ưu tiên tốc độ (Latency). Chatbot trả lời tức thì (1-2s). Trái lại, việc phải chờ 15s cho 1 cú chốt của Agent tạo cảm giác lo âu. Tuy nhiên về mặt tính chuẩn xác nội dung tra cứu thì Agent là đáng tin cậy hơn hẳn do nó móc nối dữ liệu thời gian thực và tự biết khi nào "Không tìm thấy kết quả" thay vì bịa đặt (hallucination).
3.  **Observation**: Dù hiện tại chưa in ra, nhưng quan sát thông lượng truyền tải từ Data Response (qua mạng), lượng text sinh ra thông qua Observation để mồi lại cho agent là cực kì lớn nếu so sánh với text output của Chatbot Baseline. Đây là đánh đổi chi phí lớn cần lưu ý.

---

## IV. Future Improvements (5 Points)

*How would you scale this for a production-level AI agent system?*

- **Scalability**: Nâng cấp công nghệ giao tiếp Frontend - Backend từ REST API truyền thống sang **WebSockets (WSS)** hoặc **Server-Sent Events (SSE)**. Khi Backend có suy nghĩ (`Thought`) hay hành động mới, dữ liệu sẽ stream ngay về client, khắc phục ngay điểm yếu "blackbox chậm chạp" hiện tại tạo ra sự trực quan (Explainable AI) cho người dùng cuối. 
- **Safety**: Xây dựng UI component mang tên **"Human-in-the-Loop (HitL)"**. Đối với các tính năng như gửi hồ sơ ứng tuyển, UI sẽ bật lên Dialog box cảnh báo yêu cầu người dùng xác nhận các thông số trước khi để backend tự tiện gọi Action.
- **Performance**: Thiết kế giao diện bất đồng bộ với Lazy Loading và duy trì Offline Local Cache (như IndexedDB/LocalStorage). Không nên gửi lại toàn bộ array context chat với đồ thị ReAct mỗi bận người dung F5 trang vì nó làm nghẽn băng thông.
