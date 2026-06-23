from pydantic_settings import BaseSettings, SettingsConfigDict
import logging
import sys
import os

# ENV CONFIG
class Settings(BaseSettings):
    gemini_api_key:str 

    # tell pydantic to read from .env file
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Instatiate
settings = Settings()

# ==========================================
# STRUCTURAL LOGGING SETUP
# ==========================================
logger = logging.getLogger("career-toolkit")
logger.setLevel(logging.DEBUG)

if not logger.handlers:
    # file handler
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    log_filepath = os.path.join(log_dir,"pipeline.log")
    
    file_formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(filename)s:%(lineno)d]: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    file_handler = logging.FileHandler(log_filepath, encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # console handler
    console_formatter = logging.Formatter("%(message)s")
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

