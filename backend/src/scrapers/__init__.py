from src.scrapers.jobstreet_scraper import JobStreetScraper

SCRAPER_REGISTRY = [
    JobStreetScraper,
]

def get_scraper_for_url(url: str):
    for scraper_cls in SCRAPER_REGISTRY:
        if scraper_cls.domain_keyword in url:
            return scraper_cls

    return None