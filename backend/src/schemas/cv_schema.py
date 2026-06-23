from pydantic import BaseModel, Field, EmailStr, HttpUrl, model_validator
from typing import Optional

class IdentityModel(BaseModel):
    # if regex fails, we keep "Not Found" string fallback, or use None
    name: Optional[str] = Field(default="Not Found")
    email: Optional[EmailStr] = Field(default=None)
    phone: Optional[str] = Field(default="Not Found")
    linkedin: Optional[HttpUrl] = Field(default=None)
    website: Optional[HttpUrl] = Field(default=None)

    @model_validator(mode="after")
    def check_minimal_identity(self) -> "IdentityModel":
        """Ensures that the CV parser extracted at least a name and contact"""
        self.name = self.name.strip()
        self.email = self.email.strip()

        if self.name == "Not Found" and self.email == "Not Found":
            raise ValueError(
                "CV Extraction failed critically: Unable to determine candidate name or email."
                "Please check if the PDF format is scanable text."
            )

        return self

class CVContentModel(BaseModel):
    summary: str = Field(default="")
    experience: str = Field(default="")
    skills: str = Field(default="")
    education: str = Field(default="")
    certifications: str = Field(default="")
    projects: str = Field(default="")
    training: str = Field(default="")

class CVDataModel(BaseModel):
    identity: IdentityModel
    content: CVContentModel

