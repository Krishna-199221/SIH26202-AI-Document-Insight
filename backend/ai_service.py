import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the .env file")

client = genai.Client(api_key=api_key)


def generate_insights(document_text: str):
    prompt = f"""
Analyze the following document.

Return ONLY valid JSON using exactly this structure:

{{
    "summary": [
        "5 to 7 concise summary points"
    ],
    "insights": [
        "3 important insights or takeaways"
    ],
    "actions": [
        "recommended action items if applicable"
    ]
}}

Document:
{document_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json"
        }
    )

    return json.loads(response.text)