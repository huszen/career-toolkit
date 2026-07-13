from abc import ABC, abstractmethod
from typing import Dict, Tuple
from bs4 import BeautifulSoup

class BaseScraper(ABC):

    @property
    @abstractmethod
    def domain_keyword(self) -> str:
        """ The Keyword to match against URL"""
        pass

    @staticmethod
    @abstractmethod
    def extract_id_and_normalize(url: str) -> Tuple[str, str]:
        """ Extract the Job ID and return (job_id, clean_url)"""
        pass

    @staticmethod
    @abstractmethod
    def extract_content(soup: BeautifulSoup) -> Dict:
        """ Parse raw HTML soup and return structured dictionary data"""
        pass
