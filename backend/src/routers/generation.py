import os
import traceback
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from src.config import TEMP_DIR, db, logger
from src.pipelines.application_pipeline import run_pipeline
from src.schemas.cv_schema import CVDataModel
from src.utils.auth_utils import get_optional_current_user

router = APIRouter(prefix="/api/generate-cover-letter", tags=["Generation"])


@router.post("")
async def generate_cover_letter(
    request: Request,
    job_url: str = Form(...),
    cv_file: UploadFile | None = None,
    run_gap_analysis: bool = Form(False),  # Capture the new frontend toggle parameter
    current_user: dict | None = Depends(get_optional_current_user),
):
    temp_pdf_path = None
    try:
        resolved_cv_data: CVDataModel | None = None

        # 1. user uploaded a manual pdf file
        # Save the uploaded file temporarily so the pipeline can read it via path
        if cv_file and cv_file.filename:
            extension = os.path.splitext(cv_file.filename)[1]
            temp_pdf_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{extension}")
            with open(temp_pdf_path, "wb") as buffer:
                buffer.write(await cv_file.read())

        # 2. No CV PDF proviced -> Attempt to fetch saved profile from firestore
        elif current_user:
            user_id = current_user["uid"]
            cv_doc = db.collection("users").document(user_id).collection("profile").document("cv_data").get()
            if cv_doc.exists:
                doc_data = cv_doc.to_dict()
                resolved_cv_data = CVDataModel(**doc_data)
            else:
                raise HTTPException(
                    status_code=400, detail="No Uploaded CV provided and no saved CV profile found in your profile"
                )
        else:
            raise HTTPException(
                status_code=400, detail="Please upload your CV PDF or log in to user your saved CV Profile."
            )

        # 3. Run pipeline
        # Run the new multi-task pipeline architecture
        try:
            pipeline_result = run_pipeline(
                pdf_path=temp_pdf_path, job_url=job_url, run_gap_analysis=run_gap_analysis, cv_data=resolved_cv_data
            )
        finally:
            # Clean up uploaded temporary file
            if temp_pdf_path and os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)

        if not pipeline_result:
            raise HTTPException(status_code=500, detail="Master Application Pipeline failed execution entirely.")

        cover_letter_path = pipeline_result.cover_letter_path

        # Construct a public endpoint URL instead of forcing an immediate file stream binary transfer
        download_url = None
        if cover_letter_path and os.path.exists(cover_letter_path):
            filename = os.path.basename(cover_letter_path)
            # download_url = request.url_for("static", path=filename)
            download_url = str(request.url_for("static", path=filename))

        # Return comprehensive response payload including gap analysis data object structures

        return {
            "success": True,
            "job_title": pipeline_result.job_title,
            "company": pipeline_result.company,
            "cover_letter_url": download_url,
            "gap_analysis": pipeline_result.gap_analysis_report,
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
