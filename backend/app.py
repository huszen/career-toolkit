import os 
import uuid
import uvicorn
import traceback

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from src.pipelines.application_pipeline import run_pipeline

from src.config import db, logger
from src.utils.auth_utils import get_current_user
from src.schemas.saved_job_schema import SaveJobRequestModel, UpdateJobStatusModel
from datetime import datetime, timezone

from firebase_admin import firestore

# Initiate App
app = FastAPI(title="Career Toolkit API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

TEMP_DIR = "assets/temp_uploads"
OUTPUT_CL_DIR = "outputs/generated_cover_letter"

os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUTPUT_CL_DIR, exist_ok=True)

# Mount the output folder so files are accessible at http://127.0.0.1.8000/static/filename.pdf
app.mount("/static", StaticFiles(directory=OUTPUT_CL_DIR), name="static")


@app.post("/api/generate-cover-letter")
async def generate_cover_letter(
    request: Request,
    job_url: str = Form(...),
    cv_file: UploadFile = File(...),
    run_gap_analysis: bool = Form(False) # Capture the new frontend toggle parameter
):
    try:
        # Save the uploaded file temporarily so the pipeline can read it via path
        extension = os.path.splitext(cv_file.filename)[1]

        temp_pdf_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{extension}")
        with open(temp_pdf_path, "wb") as buffer:
            buffer.write(await cv_file.read())

        # Run the new multi-task pipeline architecture
        try:
            pipeline_result = run_pipeline(
                pdf_path=temp_pdf_path,
                job_url=job_url,
                run_gap_analysis=run_gap_analysis
            )
        finally:
            # Clean up uploaded temporary file
            if os.path.exists(temp_pdf_path):
                os.remove(temp_pdf_path)

        if not pipeline_result:
            raise HTTPException(status_code=500, detail="Master Application Pipeline failed execution entirely.")
        
        cover_letter_path = pipeline_result.get("cover_letter_path")

        # Construct a public endpoint URL instead of forcing an immediate file stream binary transfer
        download_url = None
        if cover_letter_path and os.path.exists(cover_letter_path):
            filename = os.path.basename(cover_letter_path)
            download_url = request.url_for("static", path=filename)

        # Return comprehensive response payload including gap analysis data object structures

        return {
            "success":True,
            "cover_letter_url":download_url,
            "gap_analysis":pipeline_result.get("gap_analysis_report")
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# DASHBOARD & JOB TRACKING ENDPOINTS
# ==========================================
@app.post("/api/jobs/save")
async def save_job_to_dashboard(
    payload: SaveJobRequestModel,
    current_user: dict = Depends(get_current_user)
):
    """Saves a generated/scraped job application to the authenticated user's Firestore dashboard."""
    try:
        user_id = current_user["uid"]
        jobs_collection = db.collection("users").document(user_id).collection("saved_jobs")

        # Create a document structure combining user payload with server timestamp
        job_data = payload.model_dump()
        job_data["created_at"] = datetime.now(timezone.utc).isoformat()
        job_data["updated_at"] = datetime.now(timezone.utc).isoformat()

        # Add to Firestore (returns timestamp and document reference)
        update_time, doc_ref = jobs_collection.add(job_data)

        logger.info(f"User {user_id} saved_job {doc_ref.id} ({payload.job_title} at {payload.company})")

        return {
            "success":True,
            "job_id":doc_ref.id,
            "message": "Job Successfully saved to dashboard"
        }
    
    except Exception as e:
        logger.error(f"Failed to save job to Firestore: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save job to database")

@app.get("/api/jobs")
async def get_user_saved_jobs(current_user: dict = Depends(get_current_user)):
    """
    Retrieves all saved jobs for the logged-in user from Firestore
    """
    try:
        user_id = current_user["uid"]
        jobs_ref = db.collection("users").document(user_id).collection("saved_jobs")

        # Order by most recently updated
        docs = jobs_ref.order_by("updated_at", direction=firestore.Query.DESCENDING).stream()

        saved_jobs = []
        for doc in docs:
            job_dict = doc.to_dict()
            job_dict["id"] = doc.id # Include the firestore document id for frontend mapping
            saved_jobs.append(job_dict)

        return {
            "success":True,
            "count":len(saved_jobs),
            "jobs":saved_jobs
        }
    except Exception as e:
        logger.error(f"Failed to fetch jobs for user {current_user.get('uid')} : {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve saved jobs")

@app.patch("/api/jobs/{job_id}/status")
async def update_job_status(
    job_id:str,
    payload: UpdateJobStatusModel,
    current_user: dict = Depends(get_current_user)
):
    """
    Allows the user to manually change application status (e.g, Saved -> Applied -> Interviewing)
    """
    try:
        user_id = current_user["uid"]
        doc_ref = db.collection("users").document(user_id).collection("saved_jobs").document(job_id)

        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Job application not found")

        # Update status and timestamp
        doc_ref.update({
            "status":payload.status,
            "updated_at": datetime.now(timezone.utc).isoformat()
        })

        return {
            "success":True,
            "message":f"Status updated to '{payload.status}'."
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update status for job {job_id} : {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update job status")

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
