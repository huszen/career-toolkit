import json 
import re 
from typing import Dict, Optional, Tuple

from bs4 import BeautifulSoup
from src.scrapers.base_scraper import BaseScraper

def clean_text(text: str) -> str:
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]', ' ', text)
    return text.strip()

def extract_json_ld(soup: BeautifulSoup) -> Optional[Dict]:
    """
    Search for JobPosting from JSON-LD
    """
    scripts = soup.findAll("script", type="application/ld+json")

    for script in scripts:
        try:
            if not script.string:
                continue
            data = json.loads(script.string)
            if isinstance(data,dict):
                if data.get("@type") == "JobPosting":
                    return data
                if "@graph" in data:
                    for item in data["@graph"]:
                        if item.get("@type") == "JobPosting":
                            return item
        except Exception:
            pass
    return None


class LinkedInScraper(BaseScraper):
    domain_keyword = "linkedin.com"

    @staticmethod
    def extract_id_and_normalize(url: str) -> Tuple[str, str]:
        if "linkedin.com" not in url:
            raise ValueError("Not a valid LinkedIn URL")

        # support pattern ULR : /jobs/view/1234556 or currentJobId=12312423
        match = re.search(r'/jobs/view/(\d+)', url) or re.search(r'currentJobId=(\d+)', url) or re.search(r'jobId=(\d+)', url)
        if not match:
            raise ValueError(f"Could not find a valid Job ID inside LinkedIn URL: {url}")

        job_id = match.group(1)

        # normalized url so there is no login needed
        normalized_url = f"https://www.linkedin.com/jobs/view/{job_id}/"

        return job_id, normalized_url

    @staticmethod
    def extract_content(soup: BeautifulSoup) -> Dict:
        result = {
            "title": None,
            "company": None,
            "location": None,
            "description": None,
            "requirements": None,
            "employment_type": None,
            "salary": None,
        }

        # JSON-LD Extraction
        job_json = extract_json_ld(soup=soup)
        if job_json:
            result["title"] = job_json.get("title")

            hiring_org = job_json.get("hiringOrganization")
            if isinstance(hiring_org, dict):
                result["company"] = hiring_org.get("name")

            job_location = job_json.get("jobLocation")
            if isinstance(job_location, dict):
                address = job_location.get("address")
                if isinstance(address, dict):
                    locality = address.get("addressLocality")
                    region = address.get("addressRegion")
                    country = address.get("addressCountry")
                    loc_parts = [p for p in [locality, region, country] if p]
                    result["location"] = ", ".join(loc_parts) if loc_parts else None

            raw_desc = job_json.get("description", "")
            if raw_desc:
                result["description"] = BeautifulSoup(raw_desc, "html.parser").get_text("\n")

            result["employment_type"] = job_json.get("employmentType")

            base_salary = job_json.get("baseSalary")
            if base_salary:
                result["salary"] = str(base_salary)

        # Fallback DOM Parsing
        if not result["title"]:
            title_el = soup.select_one(
                "h3.sub-nav-cta__header, h1.top-card-layout__title, h1.topcard__title, h1"
            )
            if title_el:
                result["title"] = title_el.get_text()

        if not result["company"]:
            company_el = soup.select_one(
                "a.sub-nav-cta__optional-url, a.topcard__org-name-link, span.topcard__flavor, a.top-card-layout__firstsubtext"
            )
            if company_el:
                result["company"] = company_el.get_text()

        if not result["location"]:
            loc_el = soup.select_one(
                "span.sub-nav-cta__meta-text, span.topcard__flavor--bullet, span.top-card-layout__firstsubtext:nth-child(2)"
            )
            if loc_el:
                result["location"] = loc_el.get_text()

        if not result["description"]:
            desc_el = soup.select_one(
                "div.show-more-less-html__markup, div.description__text, section.description"
            )
            if desc_el:
                result["description"] = desc_el.get_text("\n")

        # Last sanitation
        for key, value in result.items():
            if isinstance(value, str):
                result[key] = clean_text(value)


        return result