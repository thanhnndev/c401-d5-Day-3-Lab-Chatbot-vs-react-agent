import os
import sys
from dotenv import load_dotenv

# Thêm đường dẫn gốc vào sys.path để import được src.core
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.core.gemini_provider import GeminiProvider

class UniversityConsultantBot:
    """
    Class hỗ trợ chatbot tư vấn trường đại học để dễ dàng import sang file khác.
    """
    def __init__(self, system_prompt=None, max_history=5):
        # Nạp biến môi trường
        env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
        load_dotenv(env_path)
        
        api_key = os.environ.get("GEMINI_API_KEY")
        model_gemini = os.environ.get("MODEL_GEMINI", "gemini-2.5-flash")
        
        if not api_key:
            raise ValueError("Vui lòng thêm GEMINI_API_KEY vào file .env ở thư mục gốc.")

        # Khởi tạo provider sử dụng class từ core
        self.provider = GeminiProvider(api_key=api_key, model_name=model_gemini)
        
        # Cài đặt ngữ cảnh mặc định
        self.system_prompt = system_prompt or (
            "Bạn là một chuyên gia tư vấn tại trung tâm tư vấn chọn trường đại học. "
            "Nhiệm vụ của bạn là tư vấn chọn trường, đặc biệt nhấn mạnh vào vị trí "
            "địa lý và mô tả chi tiết các trường đại học ở Mỹ theo đúng mong muốn của người dùng."
        )
        self.history = []
        self.max_history = max_history

    def get_response(self, user_input: str, stream: bool = True) -> str:
        """
        Gửi câu hỏi tới model và trả về response.
        Nếu stream=True, sẽ in kết quả trực tiếp ra console theo thời gian thực (như khi chat).
        Nếu stream=False, sẽ đợi và gọi model lấy toàn bộ câu trả lời 1 lần.
        """
        # Xây dựng prompt kết hợp ngữ cảnh là các câu lịch sử
        context_prompt = ""
        if self.history:
            context_prompt += "Một số thông tin từ các câu hỏi trước để làm ngữ cảnh:\n"
            for i, (q, a) in enumerate(self.history, 1):
                context_prompt += f"[User]: {q}\n[AI]: {a}\n"
            context_prompt += "\nDựa vào ngữ cảnh trên, hãy trả lời câu hỏi sau:\n"
        
        context_prompt += user_input

        full_response = ""
        
        # Gọi model
        if stream:
            for chunk in self.provider.stream(context_prompt, system_prompt=self.system_prompt):
                print(chunk, end="", flush=True)
                full_response += chunk
            print()
        else:
            # Nếu không dùng stream, có thể dùng generate (phải check xem GeminiProvider có hỗ trợ sinh không)
            try:
                response_dict = self.provider.generate(context_prompt, system_prompt=self.system_prompt)
                full_response = response_dict["content"]
            except Exception as e:
                # Fallback nếu provider.generate bị lỗi
                for chunk in self.provider.stream(context_prompt, system_prompt=self.system_prompt):
                    full_response += chunk
            if not stream:
                pass # nếu muốn in hay không thì tùy người gọi

        # Lưu thêm vào mảng history
        self.history.append((user_input.strip(), full_response.strip()))
        
        # Bỏ bớt câu hỏi cũ nhất để giữ tối đa 'max_history' câu
        if len(self.history) > self.max_history:
            self.history.pop(0)

        return full_response
        
    def clear_history(self):
        self.history = []


def main():
    """
    Hàm để chạy thử trên terminal
    """
    try:
        bot = UniversityConsultantBot()
        print("Chatbot đã sẵn sàng! Gõ 'exit', 'quit' hoặc 'thoát' để kết thúc.")
    except Exception as e:
        print(f"Lỗi khởi tạo: {e}")
        return

    while True:
        try:
            user_input = input("\nBạn: ")
            
            # Kết thúc vòng lặp nếu có từ khóa thoái
            if user_input.strip().lower() in ['exit', 'quit', 'thoát']:
                print("Chatbot: Tạm biệt!")
                break
                
            if not user_input.strip():
                continue

            print("Chatbot: ", end="", flush=True)
            bot.get_response(user_input, stream=True)

        except KeyboardInterrupt:
            print("\nChatbot: Tạm biệt!")
            break
        except Exception as e:
            print(f"\nĐã có lỗi xảy ra: {e}")


if __name__ == "__main__":
    main()
