import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from src.config import OUTPUT_CL_DIR

# Import Routers
from src.routers import cv, generation, jobs

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
    allow_headers=["*"],
)

# Mount the output folder so files are accessible at http://127.0.0.1:8000/static/filename.pdf
app.mount("/static", StaticFiles(directory=OUTPUT_CL_DIR), name="static")


# ==========================================
# COVER LETTER GENERATION ENDPOINTS
# ==========================================
app.include_router(generation.router)

# ==========================================
# DASHBOARD & JOB TRACKING ENDPOINTS
# ==========================================
app.include_router(jobs.router)

# ==========================================
# CV Profile Endpoints
# ==========================================
app.include_router(cv.router)

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
