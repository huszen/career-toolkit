from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from src.schemas.cv_schema import CVDataModel
from src.schemas.job_description_schema import JobDescriptionModel

class ApplicationContext(BaseModel):
    """
    Unified context container storing the extracted CV state
    and scraped Job description state
    """
    cv_data: CVDataModel
    job_data: JobDescriptionModel

class PipelineResultModel(BaseModel):
    """
    Standarized return payload structure for the Master Application Pipeline
    """
    job_title: str = Field(default="Unknown Title")
    company: str = Field(default="Unknown Company")
    cover_letter_path : Optional[str] = None
    gap_analysis_report: Optional[Dict[str, Any]] = None 