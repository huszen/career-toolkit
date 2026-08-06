from google import genai
from src.config import settings

from src.schemas.generated_cover_letter_schema import CoverLetterSchema

def generate_cover_letter(user_content, system_instruction, gemini_model="gemini-2.5-flash"):
    client = genai.Client(api_key=settings.gemini_api_key)

    response = client.models.generate_content(
        model=gemini_model,
        contents=user_content,
        config={
            "system_instruction": system_instruction,
            "temperature": 0.7,
            "response_mime_type": "application/json",
            "response_schema": CoverLetterSchema,
        }
    )

    return response
