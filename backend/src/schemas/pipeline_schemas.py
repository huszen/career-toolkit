from pydantic import BaseModel
from typing import Any

from src.schemas.cv_schema import CVDataModel
from src.schemas.job_description_schema import JobDescriptionModel

class ApplicationContext(BaseModel):
    """
    Unified context container storing the extracted CV state
    and scraped Job description state
    """
    cv_data: CVDataModel
    job_data: JobDescriptionModel