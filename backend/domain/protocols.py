import os
from pathlib import Path
from typing import AsyncIterator, Protocol

from .models import Capture, LoginSession, Profile

CRAWLS_PATH = Path(os.getenv("CRAWLS_PATH", "./crawls"))
COLLECTIONS_PATH = CRAWLS_PATH / "collections"
PROFILES_PATH = CRAWLS_PATH / "profiles"

CRAWLS_VOLUME = os.getenv("CRAWLS_VOLUME", str(CRAWLS_PATH.resolve()))


class Captures(Protocol):
    """
    Store for capture requests and their associated archive files.
    """

    def stream_archive(
        self,
        file_id: str,
        start: int = 0,
        end: int | None = None,
    ) -> AsyncIterator[bytes]: ...

    async def list(self, limit: int = 12, skip: int = 0) -> list[Capture]: ...

    async def claim_next(
        self, lease_seconds: int = 120, max_attempts: int = 3
    ) -> Capture | None: ...

    async def renew_lease(self, capture_id: str, lease_token: str, lease_seconds: int) -> bool: ...

    async def start(self, capture_id: str) -> None: ...

    async def save(
        self, url: str, depth: int, limit: int, profile_id: str | None = None
    ) -> Capture: ...

    async def get(self, capture_id: str) -> Capture | None: ...

    async def delete(self, capture_id: str) -> bool: ...

    async def complete(
        self, capture_id: str, file_id: str, lease_token: str | None = None
    ) -> None: ...

    async def fail(
        self,
        capture_id: str,
        error: str,
        lease_token: str | None = None,
        max_attempts: int = 3,
        retry_delay_seconds: int = 30,
    ) -> None: ...

    async def get_archive_size(self, file_id: str) -> int: ...

    async def save_archive(self, capture_id: str, file: Path) -> str: ...

    async def delete_archive(self, file_id: str) -> None: ...


class Profiles(Protocol):
    """
    Store for browser profiles.
    """

    async def save(self, name: str, url: str, data: bytes) -> Profile: ...

    async def list(self) -> list[Profile]: ...

    async def exists(self, profile_id: str) -> bool: ...

    async def load(self, profile_id: str) -> bytes | None: ...

    async def delete(self, profile_id: str) -> bool: ...


class LoginSessions(Protocol):
    """
    Store for login sessions.
    """

    async def ensure_indexes(self) -> None: ...

    async def create(self, url: str, name: str) -> LoginSession: ...

    async def get(self, session_id: str) -> LoginSession | None: ...

    async def claim(self) -> dict | None: ...

    async def running(self, session_id: str) -> None: ...

    async def finish(
        self, session_id: str, profile_id: str | None = None, error: str | None = None
    ) -> None: ...

    async def cancel(self, session_id: str) -> bool: ...

    async def cancelled(self, session_id: str) -> bool: ...

    async def recover(self) -> None: ...


class Crawler(Protocol):
    """
    Web crawler contract.
    """

    def generate_wacz(
        self,
        fname: str,
        url: str,
        depth: int = 1,
        limit: int = 1,
        timeout_seconds: int = 600,
        profile_path: Path | None = None,
    ) -> Path: ...
