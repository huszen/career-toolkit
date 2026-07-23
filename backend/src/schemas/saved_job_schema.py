from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SaveJobRequestModel(BaseModel):
    job_url: str
    job_title: str = Field(default="Unknown Title")
    company: str = Field(default="Unknown Company")
    status: str = Field(default="Saved")
    cover_letter_url: Optional[str] = None
    gap_analysis: Optional[Dict[str, Any]] = None

class UpdateJobStatusModel(BaseModel):
    status: str

