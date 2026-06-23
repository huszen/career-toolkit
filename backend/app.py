from src.pipelines.cover_letter_generator_pipeline import run_pipeline

if __name__ == "__main__":
    # Inputs
    sample_pdf = "assets/other_cv.pdf"
    # sample_url = str(input(f"Please Enter the Jobstreet Link : "))
    sample_url = "https://id.jobstreet.com/id/job/92578709?ref=recom-homepage&pos=1&origin=showNewTab#sol=356b4f724131699031463f0d99bac25724d581bc"


    run_pipeline(pdf_path=sample_pdf, job_url=sample_url)