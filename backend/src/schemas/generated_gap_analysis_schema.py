from pydantic import BaseModel, Field


class GapAnalysisSchema(BaseModel):
    match_score: int = Field(..., description="Overall match percentage from 0 to 100 on core skills and requirements.")
    advantages: list[str] = Field(
        ..., description="Key strengths, matching skills, or experiences the candidate possesses for this role."
    )
    disadvantages: list[str] = Field(
        ...,
        description="Gap in skill, missing experiences, or areas where the candidate doesn't fully meet the job criteria.",
    )
    recommendations: list[str] = Field(
        ..., description="Actionable advice on how the candidate can bridge the gaps or highlight the hidden strenghts."
    )
