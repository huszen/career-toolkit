import os
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from src.config import OUTPUT_CL_DIR, TEMP_DIR, db, logger
from src.schemas.saved_job_schema import SaveJobRequestModel, UpdateJobStatusModel
from src.scrapers import get_scraper_for_url
from src.utils.auth_utils import get_current_user
from src.utils.text_cleaner import detect_platform_from_url

# Prefix applies to all endpoints in this file
router = APIRouter(prefix="/api/jobs", tags=["Jobs Dashboard"])


@router.post("/save")
async def save_job_to_dashboard(payload: SaveJobRequestModel, current_user: dict = Depends(get_current_user)):
    """Saves a generated/scraped job application to the authenticated user's Firestore dashboard."""
    try:
        user_id = current_user["uid"]
        jobs_collection = db.collection("users").document(user_id).collection("saved_jobs")

        # Create a document structure combining user payload with server timestamp
        job_data = payload.model_dump()

        # URL NORMALIZATION AND JOB ID EXTRACTION
        parser = get_scraper_for_url(payload.job_url)
        if parser:
            try:
                job_id, clean_url = parser.extract_id_and_normalize(payload.job_url)
                job_data["job_id"] = job_id
                job_data["job_url"] = clean_url
            except Exception as e:
                logger.warning(f"URL Normalization failed during save: {e}")
                job_data["job_id"] = None
        else:
            job_data["job_id"] = None

        # Detect job platform
        if not job_data.get("platform"):
            job_data["platform"] = detect_platform_from_url(job_data["job_url"])

        # STRICT DUPLICATE CHECK, REJECT AND IGNORE IF EXISTS
        if job_data.get("job_id"):
            # Use FeldFildter to prevent UserWarning from Firestore SDK
            existing_docs = jobs_collection.where(filter=FieldFilter("job_id", "==", job_data["job_id"])).limit(1).get()

            if len(existing_docs) > 0:
                logger.info(
                    f"User {user_id} attempted to save duplicate job_id: {job_data['job_id']}. Request rejected."
                )

                # return reponse without changing database
                return {
                    "success": False,
                    "is_duplicate": True,
                    "job_id": existing_docs[0].id,
                    "message": "This job is already saved in your dashboard.",
                }

        job_data["created_at"] = datetime.now(UTC).isoformat()
        job_data["updated_at"] = datetime.now(UTC).isoformat()

        # Add to Firestore (returns timestamp and document reference)
        update_time, doc_ref = jobs_collection.add(job_data)

        logger.info(f"User {user_id} saved_job {doc_ref.id} ({payload.job_title} at {payload.company})")

        return {
            "success": True,
            "is_duplicate": False,
            "job_id": doc_ref.id,
            "message": "Job successfully saved to dashboard.",
        }

    except Exception as e:
        logger.error(f"Failed to save job to Firestore: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save job to database")


@router.get("")
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
            job_dict["id"] = doc.id  # Include the firestore document id for frontend mapping

            # SAGEGUARD FOR OLD SAVED JOB DATA
            if "platform" not in job_dict or not job_dict["platform"]:
                job_dict["platform"] = detect_platform_from_url(job_dict.get("job_url", ""))

            saved_jobs.append(job_dict)

        return {"success": True, "count": len(saved_jobs), "jobs": saved_jobs}
    except Exception as e:
        logger.error(f"Failed to fetch jobs for user {current_user.get('uid')} : {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve saved jobs")


@router.patch("/{job_id}/status")
async def update_job_status(job_id: str, payload: UpdateJobStatusModel, current_user: dict = Depends(get_current_user)):
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
        doc_ref.update({"status": payload.status, "updated_at": datetime.now(UTC).isoformat()})

        return {"success": True, "message": f"Status updated to '{payload.status}'."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update status for job {job_id} : {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update job status")


@router.delete("/{job_id}")
async def delete_saved_job(job_id: str, current_user: dict = Depends(get_current_user)):
    """
    Deletes a saved job entry from Firestore and removes its associated PDF file if present.
    """
    try:
        user_id = current_user["uid"]
        doc_ref = db.collection("users").document(user_id).collection("saved_jobs").document(job_id)

        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Job application not found")

        job_data = doc.to_dict()
        cover_letter_url = job_data.get("cover_letter_url")

        # Cleanup local PDF file from outputs directory if present
        if cover_letter_url:
            filename = os.path.basename(cover_letter_url)
            file_path = os.path.join(OUTPUT_CL_DIR, filename)
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    logger.info(f"Cleaned up local PDF file : {file_path}")
                except Exception as file_err:
                    logger.warning(f"Could not remove PDF file : {file_path} : {str(file_err)}")

        # Delete document from firestore
        doc_ref.delete()
        logger.info(f"User {user_id} deleted job application {job_id}")

        return {"success": True, "message": "Job application successfully deleted"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete job {job_id} for user {current_user.get('uid')}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete job application")
