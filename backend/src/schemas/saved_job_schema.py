from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class SaveJobRequestModel(BaseModel):
    job_url: str
    job_title: str = Field(default="Unknown Title")
    company: str = Field(default="Unknown Company")
    platform: str | None = None
    status: str = Field(default="Saved")
    cover_letter_url: str | None = None
    gap_analysis: dict[str, Any] | None = None


class UpdateJobStatusModel(BaseModel):
    status: str
