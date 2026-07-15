# Define structureal schema using pydantic
from pydantic import BaseModel, Field

class CoverLetterSchema(BaseModel):
    greeting: str = Field(description="Formal greeting to the hiring manager")
    opening_paragraph: str = Field(description="Introduction and opening hook")
    body_paragraph_1: str = Field(description="First body paragraph on skills")
    body_paragraph_2: str = Field(description="Second body paragraph focusing on alignment with company")
    closing_paragraph: str = Field(description="Closing remarks and call to action")
    sign_off: str = Field(description="Formal sign off and name placeholder")