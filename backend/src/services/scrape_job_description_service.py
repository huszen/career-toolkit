import time 
from typing import Optional

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from src.schemas.job_description_schema import JobDescriptionModel, JobContentModel
from src.scrapers import get_scraper_for_url

def scrape_job_description(
        job_url:str,
        headless:bool = True,
        wait_time:int = 15
) -> Optional[JobDescriptionModel]:

    # dynamically match the url
    parser = get_scraper_for_url(job_url)
    if not parser:
        print(f"Error : No Scraper module registered for domain in URL -> {job_url}")
        return None

    # extract configuration using the selected strategy safely
    try:
        job_id, clean_url = parser.extract_id_and_normalize(job_url)
    except Exception as e:
        print(f"URL Normalization Error {e}")
        return None

    # chrome setup
    chrome_options = Options()
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    if headless:
        chrome_options.add_argument("--headless=new")

    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = None

    try:
        print("Launching Browser...")
        driver = webdriver.Chrome(options=chrome_options)
        print(f"Loading : {clean_url}")

        driver.get(clean_url) #browsing part

        WebDriverWait(driver, wait_time).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )

        time.sleep(3)
        print("Page succesfully loaded!")

        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        # clean noise tags
        for tag in soup(["script", "style", "svg", "noscript", "meta", "link"]):
            tag.decompose()

        # hand off the cleaned html soup to strategy parser
        job_data = parser.extract_content(soup)

        return JobDescriptionModel(
            url = clean_url,
            job_id = job_id,
            timestamp=time.strftime("%Y-%m-%d %H:%M:%S"),
            data=JobContentModel(**job_data)
        )

    except Exception as e:
        print(f"Error : {type(e).__name__} : {e}")
        return None
    finally:
        if driver:
            driver.quit()
