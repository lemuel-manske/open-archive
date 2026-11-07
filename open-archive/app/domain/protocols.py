import os
from pathlib import Path
from typing import AsyncIterator, Protocol

from .models import Capture

CRAWLS_PATH = Path(os.getenv("CRAWLS_PATH", "./crawls"))

CRAWLS_VOLUME = os.getenv("CRAWLS_VOLUME", str(CRAWLS_PATH.resolve()))


class Database(Protocol):
    """
    Database contract.
    """

    async def get_archive_size(self, file_id: str) -> int: ...

    def stream_archive(
        self,
        file_id: str,
        start: int = 0,
        end: int | None = None,
    ) -> AsyncIterator[bytes]: ...

    async def list_captures(self, limit: int = 12, skip: int = 0) -> list[Capture]: ...

    async def claim_next_capture(
        self, lease_seconds: int = 120, max_attempts: int = 3
    ) -> Capture | None: ...

    async def renew_capture_lease(
        self, capture_id: str, lease_token: str, lease_seconds: int
    ) -> bool: ...

    async def start_capture(self, capture_id: str) -> None: ...

    async def create_capture(self, capture: Capture) -> None: ...

    async def get_capture(self, capture_id: str) -> Capture | None: ...

    async def delete_capture(self, capture_id: str) -> bool: ...

    async def save_archive(self, capture_id: str, file: Path) -> str: ...

    async def delete_archive(self, file_id: str) -> None: ...

    async def complete_capture(
        self, capture_id: str, file_id: str, lease_token: str | None = None
    ) -> None: ...

    async def fail_capture(
        self, capture_id: str, error: str, lease_token: str | None = None,
        max_attempts: int = 3, retry_delay_seconds: int = 30
    ) -> None: ...


class Crawler(Protocol):
    """
    Web crawler contract.
    """

    def generate_wacz(
        self, fname: str, url: str, depth: int = 1, limit: int = 1,
        timeout_seconds: int = 600,
    ) -> Path: ...
