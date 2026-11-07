import os

from pathlib import Path
from typing import Protocol


CRAWLS_PATH = Path(
    os.getenv("CRAWLS_PATH", "./crawls")
)

CRAWLS_VOLUME = os.getenv("CRAWLS_VOLUME", str(CRAWLS_PATH.resolve()))


class Crawler(Protocol):
    '''
    Web crawler contract.
    '''
    def generate_wacz(self, url: str, depth: int = 1, limit: int = 1) -> Path: ...
