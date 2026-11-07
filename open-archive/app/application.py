from datetime import datetime, timezone
from pathlib import Path

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
) -> Path:
    capture = await app.db.get_capture(capture_id)

    assert capture is not None, f"Capture with ID {capture_id} not found"

    url = capture.url
    depth = capture.depth
    limit = capture.limit

    return app.crawler.generate_wacz(url, depth, limit)
