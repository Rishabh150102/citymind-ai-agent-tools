from langchain.agents.middleware import wrap_tool_call
from langchain_core.messages import ToolMessage

# Applying Human in the Loop concept
# Middleware code
@wrap_tool_call
def human_approval(request, handler):
    """Ask for human approval before every tool call."""
    tool_name = request.tool_call["name"]
    confirm = input(f"Agent wants to call '{tool_name}'. Approve? (yes/no): ")

    if confirm.lower() != "yes":
        return ToolMessage(
            content="Tool call denied by user!!",
            tool_call_id = request.tool_call['id']
        )
    
    return handler(request)