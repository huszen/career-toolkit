import json
import re 
import time 
from typing import Dict, Optional

from src.schemas.job_schema import JobScraperModel, JobContentModel

from bs4 import BeautifulSoup

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Extract job ID
def extract_job_id(url:str) -> str:
    # basic domain check to prevent completely unrelated URLs
    if "jobstreet.com" not in url:
        raise ValueError(f"Unsupported platform URL provided : {url}")

    # match pattern
    match_path = re.search(r'/id/job/(\d+)', url)
    match_query = re.search(r'jobId=(\d+)', url)

    if match_path:
        return match_path.group(1)
    elif match_query:
        return match_query.group(1)

    raise ValueError(f"Could not extract JobStreet job ID from URL: {url}")



# Clean excessive whitespace/newlines
def clean_text(text:str) -> str:

    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)

    return text.strip()

# Try extracting structured JSON-LD(Linked Data) Data
def extract_json_ld(soup: BeautifulSoup) -> Optional[Dict]:
    scripts = soup.find_all("script", type="application/ld+json")

    for script in scripts:
        try:
            data = json.loads(script.string)

            # care for @graph
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


# Extract meaningful job information from HTML
def extract_job_content(soup: BeautifulSoup) -> Dict:
    result = {
        "title": None,
        "company": None,
        "location" : None,
        "description": None,
        "requirements": None,
        "employment_type": None,
        "salary": None,
    }

    # 1. JSON-LD Exctraction
    job_json = extract_json_ld(soup)

    if job_json:
        result["title"] = job_json.get("title")

        # company
        hiring_org = job_json.get("hiringOrganization")
        if isinstance(hiring_org, dict):
            result["company"] = hiring_org.get("name")
        
        # job location
        job_location = job_json.get("jobLocation")
        if isinstance(job_location, dict):
            address = job_location.get('address')

            if isinstance(address, dict):
                result["location"] = address.get("addressLocality")
        
        # description
        result["description"] = BeautifulSoup(
            job_json.get("description",""),
            "html.parser"
        ).get_text("\n")

        # employment type
        result["employment_type"] = job_json.get("employmentType")

        # salary
        salary = job_json.get("baseSalary")
        if salary:
            result["salary"] = str(salary)
    
    # fallback DOM Extraction
    if not result["description"]:

        selectors = [
            '[data-automation="jobAdDetails"]',
            '[data-testid="job-details"]',
            'article',
            'main'

        ]

        for selector in selectors:
            try:
                element = soup.select_one(selector)

                if element:
                    result["description"] = clean_text(
                        element.get_text("\n")
                    )
                    break
            
            except Exception:
                pass
    
    # narrow title extraction
    if not result["title"]:
        try:
            title_element = soup.select_one('[data-automation="job-detail-title"]')

            if title_element:
                result["title"]=clean_text(title_element.get_text())
        except Exception:
            pass

    # fallback to <title> tag
    if not result["title"]:
        title_tag = soup.find("title")

        if title_tag:
            result["title"]=clean_text(title_tag.text)
    
    # narrow company extraction
    if not result["company"]:
        try:
            company_element = soup.select_one('[data-automation="advertiser-name"]')

            if company_element:
                result["company"] = clean_text(company_element.get_text())
        except Exception:
            pass
    
    # final cleaning
    for key, value in result.items():
        if isinstance(value, str):
            result[key] = clean_text(value)
    
    return result


def scrape_job_description(
        job_url:str,
        headless: bool = True,
        wait_time: int = 15
) -> Optional[JobScraperModel]:
    
    # normalize url
    try:
        job_id = extract_job_id(job_url)
    except ValueError as e:
        print(f"🚨 Validation Error: {e}")
        return None
    
    clean_url = f"https://id.jobstreet.com/id/job/{job_id}"

    # chrome setup
    chrome_options = Options()

    chrome_options.add_argument("--disable-blink-features=AutomationControlled")

    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 "
        "(Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 "
        "(KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )

    if headless:
        chrome_options.add_argument("--headless=new")
    
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = None

    try:
        print("Launching browser...")

        driver = webdriver.Chrome(options=chrome_options)

        print(f"Loading : {clean_url}")

        # HERE WHERE THE DRIVER USE THE URL
        driver.get(clean_url)

        # Wait page rendered
        WebDriverWait(driver, wait_time).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )

        # Additional wait for JS rendering
        time.sleep(3)

        print("✅ Page Loaded")

        # Get rendered HTML
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        # remove useless tags
        for tag in soup([
            "script",
            "style",
            "svg",
            "noscript",
            "meta",
            "link"
        ]):
            tag.decompose()

        
        # extract meaningful data
        job_data = extract_job_content(soup)

        result = JobScraperModel(
            url = clean_url,
            job_id = job_id,
            timestamp=time.strftime("%Y-%m-%d %H:%M:%S"),
            data=JobContentModel(**job_data)
        )

        print("✅ Meaningful context extracted")
        # print(result)

        return result
    
    except Exception as e:
        print(f"🚨 Error: {type(e).__name__} : {e}")

        return None

    finally:

        if driver:
            driver.quit()


if __name__ == "__main__":

    # job_url = "https://id.jobstreet.com/id/job/91915991"
    job_url = "https://id.jobstreet.com/id/job/92036471?ref=recom-homepage&pos=1&origin=showNewTab#sol=2139a044bccac04720256cc2346c0e47f738e1fc"


    result = scrape_job_description(job_url)

    if result:

        print("\n" + "=" * 60)

        print(f"TITLE      : {result['data']['title']}")
        print(f"COMPANY    : {result['data']['company']}")
        print(f"LOCATION   : {result['data']['location']}")

        print("=" * 60)

        # save to clean json
        file_name = result['data']['title'] + ".json"
        with open(file_name, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False) 
        
        print(f"\n 😎 Saved to {file_name}")


