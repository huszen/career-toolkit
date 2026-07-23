import logging
import os
import sys
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# ==========================================
# SETTINGS
# ==========================================
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    gemini_api_key: str

    firebase_credentials_path: Path = Field(
        default=BASE_DIR / "serviceAccountKey.json"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()


# ==========================================
# LOGGING
# ==========================================

logger = logging.getLogger("career-toolkit")
logger.setLevel(logging.DEBUG)

if not logger.handlers:
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    file_handler = logging.FileHandler(
        log_dir / "pipeline.log",
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(
        logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(filename)s:%(lineno)d]: %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(logging.Formatter("%(message)s"))

    logger.addHandler(file_handler)
    logger.addHandler(console_handler)


# ==========================================
# FIREBASE
# ==========================================

if not firebase_admin._apps:
    if settings.firebase_credentials_path.exists():
        cred = credentials.Certificate(settings.firebase_credentials_path)
        firebase_admin.initialize_app(cred)
        logger.info("Firebase Admin SDK initialized successfully")
    else:
        logger.warning(
            f"Firebase service account key not found at "
            f"{settings.firebase_credentials_path}"
        )

db = firestore.client()