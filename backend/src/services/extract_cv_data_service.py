import json
import re

import pdfplumber
from src.schemas.cv_schema import CVContentModel, CVDataModel, IdentityModel


def parse_identity(first_page) -> dict:
    """
    Uses Regex to find contact details.
    Focuses on the first 1000 characters where identity is usually located.
    """
    identity = {"name": None, "email": None, "phone": None, "linkedin": None, "website": None}

    # look only at the top of the CV for identity
    text = first_page.extract_text()
    top_content = text[:1000] if text else ""

    # email regex
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", top_content)
    if email_match:
        identity["email"] = email_match.group(0)

    # phone number regex
    phone_pattern = r"(\+?[\d\s\-\.\(\)]{8,20})"
    phone_match = re.search(phone_pattern, top_content)
    if phone_match:
        raw_phone = phone_match.group(0).strip()

        # cleanup
        clean_phone = re.sub(r"(?<!^)\+|[^\d+]", "", raw_phone)

        if len(clean_phone) >= 10:
            identity["phone"] = clean_phone

    # Links / URIs / Annotations
    if first_page.annots:
        for annot in first_page.annots:
            uri = annot.get("uri", "") if annot else ""
            if not uri:
                continue

            uri_lower = uri.lower()

            # LinkedIn URL
            if "linkedin.com" in uri_lower:
                identity["linkedin"] = uri

            # Website URL
            elif not any(
                item in uri_lower
                for item in ["wa.me", "whatsapp", "t.me", "mailto:", "tel:"]
            ):
                if not identity["website"]:
                    identity["website"] = uri


    # LinkedIn Regex Fallback
    if not identity["linkedin"]:
        linkedin_pattern = re.compile(
            r"(https?://)?(www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+",
            re.IGNORECASE,
        )

        li_match = linkedin_pattern.search(top_content)

        if li_match:
            url = li_match.group(0)
            identity["linkedin"] = (
                url if url.startswith("http") else f"https://{url}"
            )

    # fallback for name
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    if lines:
        # assuming the first non-empty line is the name
        identity["name"] = lines[0]

    return identity


def extract_cv_data(pdf_path: str) -> dict:

    # extract raw text
    raw_text = ""
    identity_data = {}

    with pdfplumber.open(pdf_path) as pdf:
        # pass the actual object for the first page
        if pdf.pages:
            identity_data = parse_identity(pdf.pages[0])

        # continue extracting raw text for sections
        for page in pdf.pages:
            raw_text += page.extract_text() + "\n"

    # define the anchor for keywords
    sections_map = {
        "summary": ["summary", "professional profile", "about me", "objective"],
        "experience": [
            "experience",
            "experiences",
            "work experience",
            "work history",
            "employement",
            "professional background",
        ],
        "skills": ["skills", "technical skills", "core competencies", "technologies", "hard skills", "soft skills"],
        "education": ["education", "academic background", "qualifications"],
        "certifications": ["certifications"],
        "projects": ["projects", "personal projects"],
        "training": ["training", "professional training"],
    }

    # find the positions of these headers in the text
    found_headers = []
    lines = raw_text.split("\n")
    structured_data = {key: "" for key in sections_map.keys()}

    # create regex pattern to find any of keywords at the start of a line
    for i, line in enumerate(lines):
        clean_line = line.strip().lower()
        for section, keywords in sections_map.items():
            if clean_line in keywords:
                found_headers.append((i, section))
                break

    # sort headers by their line number in document
    found_headers.sort()

    # slice the text between headers
    for idx, (line_num, section_name) in enumerate(found_headers):
        start = line_num + 1
        # the end of this section is the start of the next header
        if idx + 1 < len(found_headers):
            end = found_headers[idx + 1][0]
        else:
            end = len(lines)

        section_content = "\n".join(lines[start:end]).strip()
        structured_data[section_name] = section_content

    final_output = CVDataModel(identity=IdentityModel(**identity_data), content=CVContentModel(**structured_data))

    return final_output


if __name__ == "__main__":
    result = extract_cv_data("assets/my_cv.pdf")
    print(result.model_dump_json(indent=2))

    print("Extraction Complete")
