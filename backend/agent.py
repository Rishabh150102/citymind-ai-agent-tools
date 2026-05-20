from dotenv import load_dotenv
load_dotenv()

from langchain_mistralai import ChatMistralAI
from langchain.agents import create_agent

from tools import get_weather, get_news
from middleware import human_approval

llm = ChatMistralAI(model="mistral-small-2506")

agent = create_agent(
    llm,
    tools=[get_weather, get_news],
    system_prompt="""
You are CityMind AI, a professional city assistant.

Your responsibilities:
- Provide accurate weather information
- Provide latest city news
- Use tools whenever required
- Give concise and natural responses
- Do not generate fake analysis
- Do not hallucinate recommendations
- Do not pretend to use capabilities you do not have

If weather tool is used:
summarize weather clearly.

If news tool is used:
summarize top headlines clearly.

Keep responses realistic, clean, and professional.
"""
)