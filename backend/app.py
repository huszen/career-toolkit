import os 
import uvicorn
import traceback

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from src.pipelines.application_pipeline import run_pipeline

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
    job_url: str = Form(...),
    cv_file: UploadFile = File(...),
    run_gap_analysis: bool = Form(False) # Capture the new frontend toggle parameter
):
    try:
        # Save the uploaded file temporarily so the pipeline can read it via path
        temp_pdf_path = os.path.join(TEMP_DIR, cv_file.filename)
        with open(temp_pdf_path, "wb") as buffer:
            buffer.write(await cv_file.read())

        # Run the new multi-task pipeline architecture
        pipeline_result = run_pipeline(
            pdf_path=temp_pdf_path,
            job_url=job_url,
            run_gap_analysis=run_gap_analysis
        )

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
            download_url = f"http://127.0.0.1:8000/static/{filename}"

        # Return comprehensive response payload including gap analysis data object structures

        return {
            "success":True,
            "cover_letter_url":download_url,
            "gap_analysis":pipeline_result.get("gap_analysis_report")
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
