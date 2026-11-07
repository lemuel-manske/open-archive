import asyncio
from collections.abc import AsyncIterator
from datetime import datetime, timezone

from app.domain.models import Capture
from app.domain.protocols import Crawler, Database


class Application:
    db: Database

    crawler: Crawler | None = None


def init_app(**kwargs):
    app = Application()

    db = kwargs.get("db")
    assert db is not None, "Database instance is required"

    crawler = kwargs.get("crawler")

    app.db = db
    app.crawler = crawler

    return app


async def request_capture(
    app: Application,
    url: str,
    depth: int,
    limit: int,
) -> Capture:
    capture = Capture(
        url=url,
        depth=depth,
        limit=limit,
        status="pending",
        created_at=datetime.now(timezone.utc),
    )

    await app.db.create_capture(capture)

    return capture


async def get_capture(app: Application, capture_id: str) -> Capture | None:
    return await app.db.get_capture(capture_id)


async def delete_capture(app: Application, capture_id: str) -> bool:
    return await app.db.delete_capture(capture_id)


# just used for testing purposes, not exposed as an endpoint. See `worker`
async def generate_wacz(
    app: Application,
    capture_id: str,
) -> str:
    capture = await app.db.get_capture(capture_id)

    if capture is None:
        raise LookupError(f"Capture not found: {capture_id}")

    await app.db.start_capture(capture_id)

    assert app.crawler is not None, "Crawler instance is required"

    try:
        path = await asyncio.to_thread(
            app.crawler.generate_wacz,
            capture._id,
            capture.url,
            capture.depth,
            capture.limit,
        )

        file_id = await app.db.save_archive(
            capture_id,
            path,
        )

        await app.db.complete_capture(
            capture_id,
            file_id,
        )

        return file_id

    except Exception as exc:
        await app.db.fail_capture(
            capture_id,
            str(exc),
        )
        raise


async def list_captures(app: Application, limit: int = 12, skip: int = 0) -> list[Capture]:
    return await app.db.list_captures(limit=limit, skip=skip)


async def stream_capture_archive(
    app: Application,
    capture_id: str,
    start: int = 0,
    end: int | None = None,
) -> AsyncIterator[bytes]:
    capture = await app.db.get_capture(capture_id)

    if capture is None:
        raise LookupError(capture_id)

    if capture.archive_file_id is None:
        raise RuntimeError("Archive not available")

    async for chunk in app.db.stream_archive(
        capture.archive_file_id,
        start=start,
        end=end,
    ):
        yield chunk
