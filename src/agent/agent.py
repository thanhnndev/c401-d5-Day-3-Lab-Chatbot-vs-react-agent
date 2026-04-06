import os
import re
from typing import List, Dict, Any, Optional
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger
from src.telemetry.metrics import tracker

class ReActAgent:
    # """
    # SKELETON: A ReAct-style Agent that follows the Thought-Action-Observation loop.
    # Students should implement the core loop logic and tool execution.
    # """
    
    def __init__(self, llm: LLMProvider, tools: List[Dict[str, Any]], max_steps: int = 5):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps
        self.history = []

    def get_system_prompt(self) -> str:
        # """
        # TODO: Implement the system prompt that instructs the agent to follow ReAct.
        # Should include:
        # 1.  Available tools and their descriptions.
        # 2.  Format instructions: Thought, Action, Observation.
        # """
        tool_descriptions = "\n".join([f"- {t['name']}: {t['description']}. Args: {t['parameters']}" for t in self.tools])
        return f"""
        You are an intelligent assistant. You have access to the following tools:
        {tool_descriptions}

        Use the following format:
        Thought: your line of reasoning.
        Action: tool_name(arguments)
        Observation: result of the tool call.
        ... (repeat Thought/Action/Observation if needed)
        Final Answer: your final response.
        """

    def run(self, user_input: str) -> str:
        # """
        # TODO: Implement the ReAct loop logic.
        # 1. Generate Thought + Action.
        # 2. Parse Action and execute Tool.
        # 3. Append Observation to prompt and repeat until Final Answer.
        # """
        logger.log_event("AGENT_START", {"input": user_input, "model": self.llm.model_name})
        
        current_prompt = user_input
        steps = 0

        while steps < self.max_steps:
            # TODO: Generate LLM response
            # result = self.llm.generate(current_prompt, system_prompt=self.get_system_prompt())
            response = self.llm.generate(current_prompt, system_prompt=self.get_system_prompt())
            content = response["content"]
            tracker.track_request(response["provider"], self.llm.model_name, response["usage"], response["latency_ms"])
            
            print(f"\n--- Step {steps+1} ---\n{content}")

            # TODO: Parse Thought/Action from result
            if "Final Answer:" in content:
                logger.log_event("AGENT_END", {"steps": steps + 1, "status": "success"})
                return content.split("Final Answer:")[-1].strip()

            # TODO: If Action found -> Call tool -> Append Observation
            # TODO: If Final Answer found -> Break loop

            action_match = re.search(r"Action:\s*(\w+)\((.*)\)", content)
            if action_match:
                tool_name, tool_args = action_match.groups()
                observation = self._execute_tool(tool_name, tool_args)
                print(f"Observation: {observation}")
                current_prompt += f"\n{content}\nObservation: {observation}"
            else:
                logger.log_event("AGENT_END", {"steps": steps + 1, "status": "success_with_fallback"})
                return content
            
            steps += 1
            
        logger.log_event("AGENT_END", {"steps": steps, "status": "max_steps_reached"})
        return "Not implemented. Fill in the TODOs!"

    # def _execute_tool(self, tool_name: str, args: str) -> str:
    #     # """
    #     # Helper method to execute tools by name.
    #     # """
    #     for tool in self.tools:
    #         if tool['name'] == tool_name:
    #             # TODO: Implement dynamic function calling or simple if/else
    #             logger.log_event("TOOL_CALL", {"tool": tool_name, "args": args})
    #             return f"Result of {tool_name} with arguments {args}"
    #     return f"Tool {tool_name} not found."

    def _execute_tool(self, tool_name: str, args: str) -> str:
        for tool in self.tools:
            if tool['name'] == tool_name:
                logger.log_event("TOOL_CALL", {"tool": tool_name, "args": args})
                
                # Biến args là string trả về từ LLM (VD: "'Canada', 'Data'"). Cần parse nó để truyền vào hàm:
                try:
                    # Gợi ý đơn giản: Tách argument string bằng dấu phẩy và làm sạch chuỗi
                    parsed_args = [arg.strip().strip("'\"") for arg in args.split(",") if arg.strip()]
                    result = tool['func'](*parsed_args)
                    return str(result)
                except Exception as e:
                    return f"Lỗi khi thực thi tool {tool_name}: {str(e)}"
                    
        return f"Tool {tool_name} không tồn tại."
