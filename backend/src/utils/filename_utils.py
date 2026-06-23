import re

def build_output_filename(
        company_name: str,
        job_title: str,
        candidate_name: str,
) -> str:

    filename = (
        f"{company_name}_{job_title}_{candidate_name}"
    )

    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    filename = filename.replace(" ", "_")


    return f"{filename}.pdf"