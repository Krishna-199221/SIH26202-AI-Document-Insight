import os
import json
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the .env file")

client = genai.Client(api_key=api_key)


def generate_insights(document_text: str):
    prompt = f"""
Analyze the following document deeply and carefully.

Return ONLY valid JSON using exactly this structure:

{{
    "summary": [
        "8 to 10 detailed summary bullet points"
    ],
    "insights": [
        "8 important and detailed insights"
    ],
    "actions": [
        "6 to 8 detailed recommended action items when applicable"
    ]
}}

SUMMARY REQUIREMENTS:
- Provide 6 to 8 bullet points.
- Each bullet point must contain 2 to 3 complete sentences.
- Explain the important concepts, relationships, findings, processes,
  evidence, examples, and implications found in the document.
- Preserve important facts, numbers, technical terminology, and examples.
- Connect related information instead of listing isolated facts.
- The summary should help a reader understand the document deeply
  without reading the entire original document.
- Do not make the summary generic, repetitive, or superficial.
- Do not simply copy sentences from the document.
- Every bullet should contain meaningful information.

KEY INSIGHTS REQUIREMENTS:
- Provide exactly 8 important insights.
- Each insight must be substantially different from the others.
- For every insight, explain:
  1. What the insight is.
  2. Why it matters.
  3. What it means in the context of the document.
- Focus on deeper conclusions, relationships, patterns, implications,
  comparisons, findings, and significant takeaways.
- Do not simply repeat the summary.
- Do not invent information that is not supported by the document.

RECOMMENDED ACTION REQUIREMENTS:
- Provide 6 to 7 detailed action items when the document supports
  meaningful recommendations.
- Each action should explain:
  1. What should be done.
  2. Why it should be done.
  3. What outcome it could produce.
- Make recommendations practical and specific to the document.
- Avoid vague recommendations such as "do more research".
- Do not invent actions that are not supported by the document.
- If the document genuinely does not support meaningful recommendations,
  return an empty actions array.

ACCURACY REQUIREMENTS:
- Use ONLY information supported by the document.
- Do not hallucinate facts.
- Do not introduce unrelated external information.
- Preserve the original meaning and context of the document.

Document:
{document_text}
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json"
                }
            )

            return json.loads(response.text)

        except Exception as e:
            if "503" in str(e) and attempt < 2:
                time.sleep(3)
            else:
                raise


def generate_pdf_insights(file_bytes: bytes):
    import tempfile

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
Analyze this PDF document deeply and carefully.

Return ONLY valid JSON using exactly this structure:

{
    "summary": [
        "8 to 10 detailed summary bullet points"
    ],
    "insights": [
        "8 important and detailed insights"
    ],
    "actions": [
        "6 to 8 detailed recommended action items when applicable"
    ]
}

SUMMARY REQUIREMENTS:
- Provide 8 to 10 bullet points.
- Each bullet point must contain 2 to 3 complete sentences.
- Explain the important concepts, relationships, findings, processes,
  evidence, examples, and implications found in the document.
- Preserve important facts, numbers, technical terminology, and examples.
- Connect related information instead of listing isolated facts.
- The summary should help a reader understand the document deeply
  without reading the entire original document.
- Do not make the summary generic, repetitive, or superficial.
- Do not simply copy sentences from the document.
- Every bullet should contain meaningful information.

KEY INSIGHTS REQUIREMENTS:
- Provide exactly 8 important insights.
- Each insight must be substantially different from the others.
- For every insight, explain:
  1. What the insight is.
  2. Why it matters.
  3. What it means in the context of the document.
- Focus on deeper conclusions, relationships, patterns, implications,
  comparisons, findings, and significant takeaways.
- Do not simply repeat the summary.
- Do not invent information that is not supported by the document.

RECOMMENDED ACTION REQUIREMENTS:
- Provide 6 to 8 detailed action items when the document supports
  meaningful recommendations.
- Each action should explain:
  1. What should be done.
  2. Why it should be done.
  3. What outcome it could produce.
- Make recommendations practical and specific to the document.
- Avoid vague recommendations.
- Do not invent actions that are not supported by the document.
- If the document genuinely does not support meaningful recommendations,
  return an empty actions array.

ACCURACY REQUIREMENTS:
- Use ONLY information supported by the document.
- Do not hallucinate facts.
- Do not introduce unrelated external information.
- Preserve the original meaning and context of the document.

Focus only on information contained in the PDF.
"""

        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=[prompt, pdf_file],
                    config={
                        "response_mime_type": "application/json"
                    }
                )

                return json.loads(response.text)

            except Exception as e:
                if "503" in str(e) and attempt < 2:
                    time.sleep(3)
                else:
                    raise

    finally:
        # Delete temporary PDF from our computer
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)