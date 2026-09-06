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
def generate_pdf_insights(file_bytes: bytes):
    import tempfile
    import os

    temp_path = None

    try:
        # Create a temporary PDF file
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:
            temp_file.write(file_bytes)
            temp_path = temp_file.name

        # Upload the actual PDF file to Gemini
        pdf_file = client.files.upload(
            file=temp_path
        )

        prompt = """
Analyze this PDF document.

Return ONLY valid JSON using exactly this structure:

{
    "summary": [
        "5 to 7 concise summary points"
    ],
    "insights": [
        "3 important insights or takeaways"
    ],
    "actions": [
        "recommended action items if applicable"
    ]
}

Focus only on information contained in the document.
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[prompt, pdf_file],
            config={
                "response_mime_type": "application/json"
            }
        )

        return json.loads(response.text)

    finally:
        # Delete temporary PDF from our computer
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)