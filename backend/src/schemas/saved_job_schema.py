from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, Field, model_validator


class SaveJobRequestModel(BaseModel):
    # Core identification & source
    job_url: str
    job_title: str = Field(default="Unknown Title")
    company: str = Field(default="Unknown Company")
    platform: str | None = None
    location: str | None = None

    # Pipeline tracking
    status: str = Field(default="Saved")
    applied_at: str | None = None

    # Analysis artifacts
    match_score: int | None = Field(default=None, ge=0, le=100)
    cover_letter_url: str | None = None
    gap_analysis: dict[str, Any] | None = None
    notes: str | None = Field(default="")

    # Audit Timestamps
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    @model_validator(mode="after")
    def sync_fields(self) -> "SaveJobRequestModel":
        # Auto-promote match_score from nested gap_analysis if not explicitly passed
        if self.match_score is None and self.gap_analysis:
            self.match_score = self.gap_analysis.get("match_score")

        # Auto-stamp applied_at if initial status is "Applied"
        if self.status == "Applied" and not self.applied_at:
            self.applied_at = datetime.now(timezone.utc).isoformat()

        return self


class UpdateJobStatusModel(BaseModel):
    status: str
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    applied_at: str | None = None
