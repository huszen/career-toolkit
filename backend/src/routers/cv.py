import os
import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from src.config import TEMP_DIR, db, logger
from src.schemas.cv_schema import CVDataModel
from src.services.extract_cv_data_service import extract_cv_data
from src.utils.auth_utils import get_current_user

router = APIRouter(prefix="/api/cv", tags=["CV Profile"])


@router.post("/upload")
async def upload_user_cv(cv_file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """
    Extracts CV data from an uploaded PDF and saves the parsed CVDataModel
    to the authenticated user's Firestore profile (overwrites existing CV).
    """
    temp_pdf_path = None
    try:
        user_id = current_user["uid"]
        extension = os.path.splitext(cv_file.filename)[1]
        temp_pdf_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}{extension}")

        with open(temp_pdf_path, "wb") as buffer:
            buffer.write(await cv_file.read())

        # Extract CV data
        extracted_cv: CVDataModel = extract_cv_data(temp_pdf_path)
        cv_dict = extracted_cv.model_dump(mode="json")
        cv_dict["updated_at"] = datetime.now(UTC).isoformat()

        # Save parsed data to firestore (users/{user_id}/profile/cv_data)
        doc_ref = db.collection("users").document(user_id).collection("profile").document("cv_data")
        doc_ref.set(cv_dict)

        logger.info(f"Successfully saved parsed CV data for user {user_id}")

        return {"success": True, "message": "CV Profile extracted and saved successfully", "cv_data": cv_dict}
    except Exception as e:
        logger.error(f"Failed to extract and save CV for user {current_user.get('uid')} : {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process CV : {str(e)}")
    finally:
        if temp_pdf_path and os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)


@router.get("")
async def get_user_cv(current_user: dict = Depends(get_current_user)):
    """
    Retrieves the saved CV profile data for the authenticated user from Firestore.
    """
    try:
        user_id = current_user["uid"]
        doc_ref = db.collection("users").document(user_id).collection("profile").document("cv_data")
        doc = doc_ref.get()

        if not doc.exists:
            return {"success": True, "cv_data": None}

        return {"success": True, "cv_data": doc.to_dict()}
    except Exception as e:
        logger.error(f"Failed to retrieve CV for user {current_user.get('uid')}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve saved CV profile")
