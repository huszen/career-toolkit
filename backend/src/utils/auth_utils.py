from fastapi import Header, HTTPException, status
from firebase_admin import auth
from src.config import logger

async def get_current_user(authorization: str = Header(None)) -> dict:
    """
    FastAPI Dependency to extract and verify the Firebase JWT token from the Authorization header.
    Returns the decoded token dictionary containing 'uid', 'email', etc.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing. You must be logged in to perform this action"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format. Must be 'Bearer <token>'."
        )

    token = authorization.split("Bearer ")[1]

    try:
        # Verify the ID token while checking if token is revoked or expired
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except auth.ExpiredIdTokenError:
        logger.warning="Authentication failed: Expired Firebase ID token."
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your session has expired. Please log in again",
        )
    except Exception as e:
        logger.error=f"Authentication failed : {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )