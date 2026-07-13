from src.pipelines.cover_letter_generator_pipeline import run_pipeline

if __name__ == "__main__":
    # Inputs
    sample_pdf = "assets/my_cv.pdf"
    # sample_url = str(input(f"Please Enter the Jobstreet Link : "))
    sample_url = "https://id.jobstreet.com/id/job/93245758?ref=recom-homepage&pos=3&origin=showNewTab#sol=fec9a4c3c5e59f488115b5fb8310fe7abbf4464f"


    run_pipeline(pdf_path=sample_pdf, job_url=sample_url)