import json
import re 
from typing import Dict, Optional, Tuple
from bs4 import BeautifulSoup
from src.scrapers.base_scraper import BaseScraper

def clean_text(text: str) -> str:
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def extract_json_id(soup: BeautifulSoup) -> Optional[Dict]:
    scripts = soup.find_all("script", type="application/ld+json")
    for script in scripts:
        try:
            data = json.loads(script.string)
            if isinstance(data, dict):
                if data.get("@type") == "JobPosting":
                    return data
                if "@graph" in data:
                    for item in data["@graph"]:
                        if item.get("@type") == "JobPosting":
                            return item
        except Exception:
            pass 

    return None

class JobStreetScraper(BaseScraper):
    domain_keyword = "jobstreet.com"

    @staticmethod
    def extract_id_and_normalize(url: str) -> Tuple[str, str]:
        if "jobstreet.com" not in url:
            raise ValueError("Not a valid JobStreet URL")

        match = re.search(r'/id/job/(\d+)', url) or re.search(r'jobId=(\d+)', url)
        if not match:
            raise ValueError(f"Could not find an identifier inside Jobstreet URL : {url}")

        job_id = match.group(1)
        normalized_url = f"https://id.jobstreet.com/id/job/{job_id}"

        return job_id, normalized_url

    @staticmethod
    def extract_content(soup: BeautifulSoup) -> Dict:
        result = {
            "title": None, "company": None, "location": None,
            "description": None, "requirements": None,
            "employment_type": None, "salary": None,
        }

        # JSON-LD Extraction
        job_json = extract_json_id(soup)
        if job_json:
            result["title"] = job_json.get("title")
            hiring_org = job_json.get("hiringOrganization")

            if isinstance(hiring_org, dict):
                result["company"] = hiring_org.get("name")

            job_location = job_json.get("jobLocation")
            if isinstance(job_location, dict):
                address = job_location.get("address")
                if isinstance(address, dict):
                    result["location"] = address.get("addressLocality")

                result["description"] = BeautifulSoup(
                job_json.get("description", ""), "html.parser").get_text("\n")

                result["employment_type"] = job_json.get("employmentType")
                salary = job_json.get("baseSalary")

                if salary:
                    result["salary"] = str(salary)

        # Fallback DOM Description
        if not result["description"]:
            selectors = ['[data-automation="jobAdDetails"]', '[data-testid="job-details"]', 'article', 'main']
            for selector in selectors:
                element = soup.select_one(selector)
                if element:
                    result["description"] = element.get_text("\n")
                    break

        # Fallback Job Title
        if not result["title"]:
            title_element = soup.select_one('[data-automation="job-detail-title"]')
            if title_element:
                result["title"] = title_element.get_text()
            else:
                title_tag = soup.find("title")
                if title_tag:
                    result["title"] = title_tag.text

        # Fallback Company name
        if not result["company"]:
            company_element = soup.select_one('[data-automation="advertiser-name"]')
            if company_element:
                result["company"] = company_element.get_text()

        # Clean text elements
        for key, value in result.items():
            if isinstance(value, str):
                result[key] = clean_text(value)


        return result
