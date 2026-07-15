from google import genai
from src.config import settings

from src.schemas.generated_gap_analysis_schema import GapAnalysisSchema

def generate_gap_analysis(user_content, system_instruction, gemini_model="gemini-2.5-flash"):
    client = genai.Client(api_key=settings.gemini_api_key)

    response = client.models.generate_content(
        model = gemini_model,
        contents=user_content,
        config={
            "system_instruction":system_instruction,
            "temperature":0.7,
            "response_mime_type":"application/json",
            "response_schema": GapAnalysisSchema
        }

    )

    return response