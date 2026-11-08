from collections.abc import AsyncIterator

from app.domain.models import Capture
from app.domain.protocols import Captures, Crawler, LoginSessions, Profiles


class Application:
    captures: Captures
    profiles: Profiles
    login_sessions: LoginSessions

    crawler: Crawler | None = None


def init_app(**kwargs):
    app = Application()

    captures = kwargs.get("captures")
    assert captures is not None, "Database instance is required"

    profiles = kwargs.get("profiles")
    assert profiles is not None, "Profiles store instance is required"

    login_sessions = kwargs.get("login_sessions")
    assert login_sessions is not None, "Login sessions store instance is required"

    crawler = kwargs.get("crawler")

    app.captures = captures
    app.profiles = profiles
    app.login_sessions = login_sessions
    app.crawler = crawler

    return app


async def create_capture(
    app: Application,
    url: str,
    depth: int,
    limit: int,
    profile_id: str | None = None,
) -> Capture:
    return await app.captures.save(url, depth, limit, profile_id)


async def get_capture(app: Application, capture_id: str) -> Capture | None:
    return await app.captures.get(capture_id)


async def delete_capture(app: Application, capture_id: str) -> bool:
    return await app.captures.delete(capture_id)


async def list_captures(app: Application, limit: int = 12, skip: int = 0) -> list[Capture]:
    return await app.captures.list(limit=limit, skip=skip)


async def stream_capture_archive(
    app: Application,
    capture_id: str,
    start: int = 0,
    end: int | None = None,
) -> AsyncIterator[bytes]:
    capture = await app.captures.get(capture_id)

    if capture is None:
        raise LookupError(capture_id)

    if capture.archive_file_id is None:
        raise RuntimeError("Archive not available")

    async for chunk in app.captures.stream_archive(
        capture.archive_file_id,
        start=start,
        end=end,
    ):
        yield chunk
