from pydantic import BaseModel, Field, field_validator
from typing import Optional

class JobContentModel(BaseModel):
    title: Optional[str] = Field(default="Unknown")
    company: Optional[str] = Field(default="Unknown")
    location: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    requirements: Optional[str] = Field(default=None)
    employment_type: Optional[str] = Field(default=None)
    salary: Optional[str] = Field(default=None)

    @field_validator("description")
    @classmethod
    def validate_description_length(cls, value: Optional[str]) -> Optional[str]:
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
