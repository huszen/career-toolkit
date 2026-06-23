# from google import genai

# def generate_cl(user_content, system_instruction,gemini_model="gemini-2.5-flash"):
#     client = genai.Client()

#     response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=user_content,
#             config={
#             "system_instruction": system_instruction,
#             "temperature": 0.7,
#             "response_mime_type": "application/json",
#             "response_schema": {
#                 "type": "OBJECT",
#                 "properties": {
#                     "greeting": {"type": "STRING"},
#                     "opening_paragraph": {"type": "STRING"},
#                     "body_paragraph_1": {"type": "STRING"},
#                     "body_paragraph_2": {"type": "STRING"},
#                     "closing_paragraph": {"type": "STRING"},
#                     "sign_off": {"type": "STRING"}
#                 },
#                 "required": [
#                     "greeting",
#                     "opening_paragraph",
#                     "body_paragraph_1",
#                     "body_paragraph_2",
#                     "closing_paragraph",
#                     "sign_off"
#                     ]
#                 }
#             }
#         )
    
#     return response

# PYDANTIC VERSION
from google import genai
from pydantic import BaseModel, Field
from src.config import settings

# Define structureal schema using pydantic
class CoverLetterSchema(BaseModel):
    greeting: str = Field(description="Formal greeting to the hiring manager")
    opening_paragraph: str = Field(description="Introduction and opening hook")
    body_paragraph_1: str = Field(description="First body paragraph on skills")
    body_paragraph_2: str = Field(description="Second body paragraph focusing on alignment with company")
    closing_paragraph: str = Field(description="Closing remarks and call to action")
    sign_off: str = Field(description="Formal sign off and name placeholder")


def generate_cl(user_content, system_instruction, gemini_model="gemini-2.5-flash"):
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
