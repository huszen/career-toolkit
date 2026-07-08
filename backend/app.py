# from src.pipelines.cover_letter_generator_pipeline import run_pipeline

# if __name__ == "__main__":
#     # Inputs
#     sample_pdf = "assets/other_cv.pdf"
#     # sample_url = str(input(f"Please Enter the Jobstreet Link : "))
#     sample_url = "https://id.jobstreet.com/id/job/92578709?ref=recom-homepage&pos=1&origin=showNewTab#sol=356b4f724131699031463f0d99bac25724d581bc"


#     run_pipeline(pdf_path=sample_pdf, job_url=sample_url)

import os 
import uvicorn
import traceback
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from src.pipelines.cover_letter_generator_pipeline import run_pipeline

app = FastAPI(title="Career Toolkit API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:5173","http://localhost:3000"],
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "assets/temp_uploads"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/api/generate-cover-letter")
async def generate_cover_letter(
    job_url: str = Form(...),
    cv_file: UploadFile = File(...)
):
    try:
        # save the uploaded file temporarily so the pipeline can read it via path
        temp_pdf_path = os.path.join(TEMP_DIR, cv_file.filename)
        with open(temp_pdf_path, "wb") as buffer:
            buffer.write(await cv_file.read())

        # run existing pipeline
        generated_pdf_path = run_pipeline(pdf_path = temp_pdf_path, job_url=job_url)

        # clean up uploaded temporarily file after loading it into memory
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

        if not generated_pdf_path or not os.path.exists(generated_pdf_path):
            raise HTTPException(status_code=500, detail="Pipeline failed to generate cover letter PDF.")

        return FileResponse(
            path=generated_pdf_path,
            media_type="application/pdf",
            filename=os.path.basename(generated_pdf_path)
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)