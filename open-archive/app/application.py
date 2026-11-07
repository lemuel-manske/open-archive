import asyncio
from datetime import datetime, timezone

from app.models import Capture
from app.protocols import Crawler, Database


class Application:
    db: Database
    crawler: Crawler


def init_app(**kwargs):
    app = Application()

    db = kwargs.get("db")
    assert db is not None, "Database instance is required"

    crawler = kwargs.get("crawler")
    assert crawler is not None, "Crawler instance is required"

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


async def generate_wacz(
    app: Application,
    capture_id: str,
) -> str:
    capture = await app.db.get_capture(capture_id)

    if capture is None:
        raise LookupError(f"Capture not found: {capture_id}")

    await app.db.start_capture(capture_id)

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
