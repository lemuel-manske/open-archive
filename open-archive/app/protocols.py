import os
from pathlib import Path
from typing import AsyncIterator, Protocol

from app.models import Capture

CRAWLS_PATH = Path(os.getenv("CRAWLS_PATH", "./crawls"))

CRAWLS_VOLUME = os.getenv("CRAWLS_VOLUME", str(CRAWLS_PATH.resolve()))


class Database(Protocol):
    """
    Database contract.
    """

    def stream_archive(self, file_id: str) -> AsyncIterator[bytes]: ...

    async def start_capture(self, capture_id: str) -> None: ...

    async def create_capture(self, capture: Capture) -> None: ...

    async def get_capture(self, capture_id: str) -> Capture | None: ...

    async def save_archive(self, capture_id: str, file: Path) -> str: ...

    async def complete_capture(self, capture_id: str, file_id: str) -> None: ...

    async def fail_capture(self, capture_id: str, error: str) -> None: ...


class Crawler(Protocol):
    """
    Web crawler contract.
    """

    def generate_wacz(self, fname: str, url: str, depth: int = 1, limit: int = 1) -> Path: ...
