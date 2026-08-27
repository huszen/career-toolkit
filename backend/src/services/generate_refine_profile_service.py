from google import genai
from src.config import logger, settings
from src.schemas.refine_cv_schema import StructuredProfileSchema


def generate_refine_profile(
    user_content: str, system_instruction: str, gemini_model: str = "gemini-2.5-flash"
) -> StructuredProfileSchema:
    """
    Executes the profile refinement pipeline using Gemini structured outputs.
    """
    try:
        client = genai.Client(api_key=settings.gemini_api_key)

        response = client.models.generate_content(
            model=gemini_model,
            contents=user_content,
            config={
                "system_instruction": system_instruction,
                "temperature": 0.0,
                "response_mime_type": "application/json",
                "response_schema": StructuredProfileSchema,
            },
        )

        return response.parsed

    except Exception as e:
        logger.error(f"Error during AI profile refinement: {str(e)}")
        raise e
