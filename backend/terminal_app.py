# from src.pipelines.cover_letter_generator_pipeline import run_pipeline
from src.pipelines.application_pipeline import run_pipeline

if __name__ == "__main__":
    # Inputs
    sample_pdf = "assets/my_cv.pdf"
    sample_url = "https://id.jobstreet.com/id/AI-engineer-jobs?jobId=93345653&type=standard"


    # run_pipeline(pdf_path=sample_pdf, job_url=sample_url)
    run_pipeline(
        pdf_path=sample_pdf,
        job_url=sample_url,
        run_gap_analysis=True
    )