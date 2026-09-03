from typing import Any

from pydantic import BaseModel, Field
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
    cover_letter_path: str | None = None
    gap_analysis_report: dict[str, Any] | None = None
    errors: list[str] = []
