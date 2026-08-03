import re 
from typing import Dict
from src.schemas.job_description_schema import JobDescriptionModel


UI_NOISE_PATTERNS = [
    r'(?i)\bshow\s+more\b',
    r'(?i)\bshow\s+less\b',
    r'(?i)\bsee\s+more\b',
    r'(?i)\bsee\s+less\b',
    r'(?i)\bread\s+more\b',
]

def clean_job_text(text: str) -> str:
    if not text:
        return ""

    # remove ui noise keywords
    for pattern in UI_NOISE_PATTERNS:
        text = re.sub(pattern, '', text)

    # normalize non-breaking spaces and weird unicode whitespace
    text = text.replace('\xa0',' ').replace('\r', '')

    # collapse multiple horizontal spaces into a single space
    text = re.sub(r'[ \t]+', ' ', text)

    # remove empty or whitespace-only lines
    lines = [line.strip() for line in text.split('\n')]
    cleaned_lines = [line for line in lines if line]

    return '\n'.join(cleaned_lines)


def sanitize_job_description_for_llm(job_model: JobDescriptionModel) -> Dict:
    """
    Cleans all string fields inside JobDescriptionModel 
    and returns a clean dictionary ready for Gemini prompt context.
    """

    raw_data = job_model.data

    clean_title = clean_job_text(raw_data.title or "")
    clean_company = clean_job_text(raw_data.company or "")
    clean_location = clean_job_text(raw_data.location or "")
    clean_desc = clean_job_text(raw_data.description or "")
    clean_reqs = clean_job_text(raw_data.requirements or "") if raw_data.requirements else None

    sanitized_dict = {
        "title": clean_title,
        "company": clean_company,
        "location": clean_location,
        "employment_type": raw_data.employment_type or "Not specified",
        "salary": raw_data.salary or "Not specified",
        "description": clean_desc,
    }

    if clean_reqs:
        sanitized_dict["requirements"] = clean_reqs

    return sanitized_dict

def detect_platform_from_url(url:str) -> str:
    """
    Detects the job board platform name from a given URL
    """

    if not url:
        return "Other"

    url_lower = url.lower()
    if "linkedin.com" in url_lower:
        return "LinkedIn"
    elif "jobstreet" in url_lower:
        return "JobStreet"
    elif "glints.com" in url_lower:
        return "Glints"
    elif "kalibrr.com" in url_lower:
        return "Kalibrr"
    elif "karir.com" in url_lower:
        return "Karir.com"
    else:
        return "Other"