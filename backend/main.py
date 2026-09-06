from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.ai_service import generate_insights


app = FastAPI(
    title="AI Document Insight Generator",
    description="Backend API for generating AI-powered document insights",
    version="1.0.0"
)


class TextRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "AI Document Insight Generator API is running"
    }


@app.post("/summarize-text")
def summarize_text(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )

    try:
        result = generate_insights(request.text)

        return  result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(e)}"
        )