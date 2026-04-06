import os
import re
from typing import List, Dict, Any, Optional
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger

class ReActAgent:
    """
    SKELETON: A ReAct-style Agent that follows the Thought-Action-Observation loop.
    Students should implement the core loop logic and tool execution.
    """
    
    def __init__(self, llm: LLMProvider, tools: List[Dict[str, Any]], max_steps: int = 5):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps
        self.history = []

    def get_system_prompt(self) -> str:
        """
        TODO: Implement the system prompt that instructs the agent to follow ReAct.
        Should include:
        1.  Available tools and their descriptions.
        2.  Format instructions: Thought, Action, Observation.
        """
        tool_descriptions = "\n".join([f"- {t['name']}: {t['description']}" for t in self.tools])
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
        """
        TODO: Implement the ReAct loop logic.
        1. Generate Thought + Action.
        2. Parse Action and execute Tool.
        3. Append Observation to prompt and repeat until Final Answer.
        """
        logger.log_event("AGENT_START", {"input": user_input, "model": self.llm.model_name})
        
        current_prompt = user_input
        steps = 0

        while steps < self.max_steps:
            # 1. Generate LLM response
            result = self.llm.generate(current_prompt, system_prompt=self.get_system_prompt())
            text = result.get("content", "")
            
            print(f"--\nStep {steps}:\n{text}\n--")
            
            # 2. Check for Final Answer
            if "Final Answer:" in text:
                final_answer = text.split("Final Answer:")[1].strip()
                logger.log_event("AGENT_END", {"steps": steps})
                return final_answer
                
            # 3. Parse Thought/Action
            # Looking for: Action: tool_name(args)
            match = re.search(r"Action:\s*(\w+)(?:\((.*?)\))?", text)
            
            if match:
                tool_name = match.group(1)
                args = match.group(2) or ""
                # Call tool
                observation = self._execute_tool(tool_name, args)
                # Append Observation
                current_prompt = f"{current_prompt}\n{text}\nObservation: {observation}\n"
            else:
                # Force the model to continue if it forgets the format
                current_prompt = f"{current_prompt}\n{text}\nObservation: Error - Please use Action: tool_name(args) or Final Answer: your answer\n"
            
            steps += 1
            
        logger.log_event("AGENT_END", {"steps": steps})
        return "Max steps reached without finding Final Answer."

    def _execute_tool(self, tool_name: str, args: str) -> str:
        """
        Helper method to execute tools by name.
        """
        for tool in self.tools:
            if tool['name'] == tool_name:
                func = tool.get('func')
                if func:
                    try:
                        if args and args.strip():
                            # For learning purpose, dynamically evaluate arguments
                            # Make func available to eval scope
                            safe_locals = {"func": func}
                            code_to_eval = f"func({args})"
                            return str(eval(code_to_eval, {"__builtins__": None}, safe_locals))
                        else:
                            return str(func())
                    except Exception as e:
                        return f"Error executing tool {tool_name}: {str(e)}"
                else:
                    return f"Tool {tool_name} configuration is missing 'func' executable."
        return f"Tool {tool_name} not found. Please select from provided tools."
