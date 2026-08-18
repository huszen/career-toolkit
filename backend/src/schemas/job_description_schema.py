from typing import Optional

from pydantic import BaseModel, Field, field_validator


class JobContentModel(BaseModel):
    title: str | None = Field(default="Unknown")
    company: str | None = Field(default="Unknown")
    location: str | None = Field(default=None)
    description: str | None = Field(default=None)
    requirements: str | None = Field(default=None)
    employment_type: str | None = Field(default=None)
    salary: str | None = Field(default=None)

    @field_validator("description")
    @classmethod
    def validate_description_length(cls, value: str | None) -> str | None:
        """Ensure the description contains substantial job information"""
        if not value or len(value.strip()) < 5:
            raise ValueError(
                "The scraped job description is empty or too short. "
                "The scraper might have been blocked or failed to load the content."
            )
        return value


class JobDescriptionModel(BaseModel):
    url: str
    job_id: str
    timestamp: str
    data: JobContentModel
