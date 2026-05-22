import os
import requests
from tavily import TavilyClient
from langchain.tools import tool



# ==============================
# Environment Variables
# ==============================

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")


# ==============================
# Tavily Client Initialization
# ==============================

tavily_client = TavilyClient(api_key=TAVILY_API_KEY)


# ==============================
# Weather Tool
# ==============================

@tool
def get_weather(city: str) -> str:
    """
    Fetch current weather conditions and temperature for a given city.

    Args:
        city (str): Name of the city.

    Returns:
        str: Current weather details including temperature and condition.
    """

    print(f"[TOOL EXECUTION] Weather tool called for city: {city}")

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    )

    try:
        response = requests.get(url, timeout=5)

        if response.status_code != 200:
            return f"Unable to fetch weather data for {city}."

        data = response.json()

        temperature = data["main"]["temp"]
        condition = data["weather"][0]["description"]

        return (
            f"Current weather in {city}:\n"
            f"- Temperature: {temperature}°C\n"
            f"- Condition: {condition}"
        )

    except requests.exceptions.Timeout:
        return "Weather service timed out. Please try again."

    except Exception as e:
        return f"Weather tool error: {str(e)}"


# ==============================
# News Tool
# ==============================

@tool
def get_news(city: str) -> str:
    """
    Fetch latest breaking news and important current events about a city.

    Args:
        city (str): Name of the city.

    Returns:
        str: Summarized latest news headlines and snippets.
    """

    print(f"[TOOL EXECUTION] News tool called for city: {city}")

    try:
        response = tavily_client.search(
            query=f"Local city news from {city} India today",
            search_depth="advanced",
            topic="news",
            max_results=3
        )

        results = response.get("results", [])

        if not results:
            return f"No recent news found for {city}."

        news_items = []

        for result in results:

            title = result.get("title", "No title available")
            # url = result.get("url", "No source available")
            snippet = result.get("content", "No summary available")

            news_items.append(
                f"Headline: {title}\n"
                f"Summary: {snippet}"
            )

        return f"Latest news from {city}:\n" + "\n".join(news_items)

    except Exception as e:
        return f"News tool error: {str(e)}"