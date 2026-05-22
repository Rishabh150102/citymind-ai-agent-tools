from fastapi import FastAPI
from pydantic import BaseModel
from agent import agent
from fastapi.middleware.cors import CORSMiddleware
from rich import print

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def home():
    return {
        "message": "City Agent Backend Running Successfully"
    }

@app.post("/chat")
async def chat(request: ChatRequest):

    user_message = request.message

    logs = [
        "Received user query",
        "Analyzing user intent",
        "Invoking LangChain agent"
    ]

    try:

        result = agent.invoke({
            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        })

        print(result)

        response_text = str(result["messages"])

        tool_count = 0

        # for message in result["messages"]:
        #     if hasattr(message, "tool_calls") and message.tool_calls:
        #         tool_count += len(message.tool_calls)

        if "get_weather" in response_text:
            tool_count += 1

        if "get_news" in response_text:
            tool_count += 1

        logs.append("Generating final response")
        logs.append("Agent execution completed")

        final_response = result["messages"][-1].content

        return {
            "status": "success",
            "response": final_response,
            "logs": logs,
            "tool_count": tool_count
        }

    except Exception as e:

        logs.append("Agent execution failed")

        return {
            "status": "error",
            "message": str(e),
            "logs": logs
        }