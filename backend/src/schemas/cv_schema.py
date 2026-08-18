from typing import Optional

from pydantic import BaseModel, EmailStr, Field, HttpUrl, model_validator


class IdentityModel(BaseModel):
    # if regex fails, we keep "Not Found" string fallback, or use None
    name: str | None = Field(default="Not Found")
    email: EmailStr | None = Field(default=None)
    phone: str | None = Field(default="Not Found")
    linkedin: HttpUrl | None = Field(default=None)
    website: HttpUrl | None = Field(default=None)

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
