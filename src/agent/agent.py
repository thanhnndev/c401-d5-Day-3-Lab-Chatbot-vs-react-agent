import os
import re
from typing import List, Dict, Any, Optional
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger


class ReActAgent:
    """
    A ReAct-style Agent that follows the Thought-Action-Observation loop.
    """

    def __init__(
        self, llm: LLMProvider, tools: List[Dict[str, Any]], max_steps: int = 5
    ):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps
        self.history = []

    def get_system_prompt(self) -> str:
        """
        System prompt that instructs the agent to follow ReAct.
        Includes available tools and format instructions.
        """
        tool_descriptions = "\n".join(
            [
                f"- {t['name']}: {t['description']}. Args: {t['parameters']}"
                for t in self.tools
            ]
        )
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

    def run(self, user_input: str) -> dict:
        """
        ReAct loop logic. Returns dict with response and steps for UI display.
        """
        logger.log_event(
            "AGENT_START", {"input": user_input, "model": self.llm.model_name}
        )

        current_prompt = user_input
        steps = 0
        step_history = []

        while steps < self.max_steps:
            # 1. Generate LLM response
            result = self.llm.generate(
                current_prompt, system_prompt=self.get_system_prompt()
            )
            text = result.get("content", "")

            print(f"--\nStep {steps}:\n{text}\n--")

            # Extract Thought if present
            thought_match = re.search(
                r"Thought:\s*(.+?)(?:\n|Action:|$)", text, re.IGNORECASE | re.DOTALL
            )
            if thought_match:
                step_history.append(
                    {
                        "type": "thought",
                        "content": thought_match.group(1).strip(),
                        "timestamp": steps * 1000,
                    }
                )

            # 2. Parse Action
            match = re.search(r"Action:\s*(\w+)\s*\(([^)]*)\)", text)

            if match:
                tool_name = match.group(1)
                args = match.group(2) or ""

                # Add action step
                step_history.append(
                    {
                        "type": "action",
                        "content": f"Using {tool_name}({args})"
                        if args
                        else f"Using {tool_name}()",
                        "timestamp": steps * 1000 + 100,
                    }
                )

                # Call tool
                observation = self._execute_tool(tool_name, args)

                # Add observation step
                step_history.append(
                    {
                        "type": "observation",
                        "content": str(observation)[:200] + "..."
                        if len(str(observation)) > 200
                        else str(observation),
                        "timestamp": steps * 1000 + 200,
                    }
                )

                # Append Observation to prompt
                current_prompt = (
                    f"{current_prompt}\n{text}\nObservation: {observation}\n"
                )

                # Check for Final Answer after executing tool
                if "Final Answer:" in text:
                    final_answer = text.split("Final Answer:")[1].strip()
                    logger.log_event("AGENT_END", {"steps": steps})
                    return {"response": final_answer, "steps": step_history}

            elif "Final Answer:" in text:
                # No Action, but has Final Answer - return immediately
                final_answer = text.split("Final Answer:")[1].strip()
                logger.log_event("AGENT_END", {"steps": steps})
                return {"response": final_answer, "steps": step_history}
            else:
                # Force the model to continue if it forgets the format
                current_prompt = f"{current_prompt}\n{text}\nObservation: Error - Please use Action: tool_name(args) or Final Answer: your answer\n"

            steps += 1

        logger.log_event("AGENT_END", {"steps": steps})
        return {
            "response": "Max steps reached without finding Final Answer.",
            "steps": step_history,
        }

    def _execute_tool(self, tool_name: str, args: str) -> str:
        """Execute tool by name with arguments."""
        for tool in self.tools:
            if tool["name"] == tool_name:
                func = tool.get("func")
                if func:
                    try:
                        if args and args.strip():
                            # Dynamically evaluate arguments
                            safe_locals = {"func": func}
                            code_to_eval = f"func({args})"
                            return str(
                                eval(code_to_eval, {"__builtins__": None}, safe_locals)
                            )
                        else:
                            return str(func())
                    except Exception as e:
                        return f"Error executing tool {tool_name}: {str(e)}"
                else:
                    return f"Tool {tool_name} missing 'func' executable."
        return f"Tool {tool_name} not found."
