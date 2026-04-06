# Individual Report: Lab 3 - Chatbot vs ReAct Agent

- **Student Name**: Tran Xuan Truong
- **Student ID**: 2A202600321
- **Date**: 2026-04-06

---

## I. Technical Contribution (15 Points)
- **Modules Implemented**: 
  - `src/tools/smart_apply.py`: Wrote 2 functions to connect to the SmartApply API (`get_country_list` and `search_schools`).
  - `src/agent/agent.py`: Completed the ReAct loop (Thought-Action-Observation), handled Regex parsing, and dynamic `_execute_tool` calls.
  - `run_agent.py`: Main execution file, connecting `ReActAgent` with the `GeminiProvider` system.
  - `tests/test_tools.py` & `tests/test_agent_parser.py`: Built mock testing scenarios to avoid depending solely on the LLM.
- **Code Highlights**: 
  - Used Regex `match = re.search(r"Action:\s*(\w+)(?:\((.*?)\))?", text)` to extract tool parameters.
  - Used `eval(code_to_eval, {"__builtins__": None}, safe_locals)` to dynamically pass parameters to tool calls instead of hardcoding them.
- **Documentation**: Developed a flexible code flow between Prompt strings, calling data retrieval functions (API 1, API 2), and feeding the input (`Observation`) back so the LLM can analyze and generate the `Final Answer`.

---

## II. Debugging Case Study (10 Points)

- **Problem Description**: Encountered Google Gemini API Rate Limit error (`429 You exceeded your current quota...`).
- **Log Source**: Terminal output (Exception trace) while testing the Chatbot flow using `run_agent.py`.
- **Diagnosis**: The Free Tier limits of the `gemini-1.5-flash` and `gemini-2.5-flash` models are too small for continuous reasoning in the ReAct loop (since a single prompt can lead the LLM to interpolate 2 - 3 intermediate Action steps).
- **Solution**: Upgraded the testing approach via Decoupling. Built `tests/test_tools.py` to directly fetch APIs and `tests/test_agent_parser.py` using static mock text (`MockLLM`) to independently test the Agent's Regex parsing logic without wasting any API credits.

---

## III. Personal Insights: Chatbot vs ReAct (10 Points)

1.  **Reasoning**: ReAct is vastly superior in terms of logical processing. Instead of answering from potentially empty underlying knowledge, the `Thought` step forces the LLM to pause and analyze "What tools do I currently have?" first. As a result, the Agent accurately calls `get_country_list` or `search_schools("Canada")` based on the user's specific request.
2.  **Reliability**: For simple Trivia/Chit-chat questions, the Agent performs worse and slower than a standard Chatbot because it carries a heavy system prompt overhead to parse. The ReAct Agent is also very fragile and prone to crashes if the Regex format output is missing even a single comma or has incorrect function call syntax (`SyntaxError`).
3.  **Observation**: The `Observation` step is the key to self-correction. If `eval()` throws an error, the error traceback is thrown into `Observation` for the next loop, allowing the LLM to recognize the syntax error and generate a new `Thought` to write a more precise command.

---

## IV. Future Improvements (5 Points)

- **Scalability**: Clean up the Regex-based Parser and the loose Python `eval()` commands. Apply standard **Native Function Calling** (e.g., Gemini/OpenAI tool call models) to pass parameters directly as JSON Schema/Zod.
- **Safety**: Remove the `eval` command entirely to ensure RCE (Remote Code Execution) Security. 
- **Performance**: Move `search_schools` network calls to Async/Await, allowing the LLM to call Parallel Multi-tools simultaneously instead of running them through a sequential loop.