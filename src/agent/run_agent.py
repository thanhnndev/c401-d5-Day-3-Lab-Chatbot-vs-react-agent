from src.agent.agent import ReActAgent
from src.agent.main import tools_definition
from src.core.openai_provider import OpenAIProvider
from dotenv import load_dotenv
import os

def main():
    load_dotenv()
    llm = OpenAIProvider(model_name="gpt-4o")
    agent = ReActAgent(llm, tools_definition)
    
    # Cung cấp sẵn ID trường vì AI không có tool để tìm ID trường nữa
    question = "Tôi có ID ngôi trường là '651f7d57e8bdb030a6ff6a66'. Hãy giúp tôi xem trường này thông tin chi tiết (địa chỉ, web) là gì và có ngành học nào liên quan đến 'Data' không nhé."
    print(f"\nUser: {question}")
    print("-" * 50)
    
    final_response = agent.run(question)
    
    print("\n" + "=" * 50)
    print("FINAL BOT ANSWER:")
    print("=" * 50)
    print(final_response)

if __name__ == "__main__":
    main()
