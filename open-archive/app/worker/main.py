import asyncio
import logging
import os

from app.domain.models import Capture
from app.domain.protocols import Crawler, Database
from app.infra.browsertrix import get_browsertrix_crawler
from app.infra.docker import get_docker_client
from app.infra.mongo import get_mongo_client, get_mongo_database

logger = logging.getLogger(__name__)

POLL_SECONDS = 2
LEASE_SECONDS = 120
HEARTBEAT_SECONDS = 30
MAX_ATTEMPTS = 3
RETRY_SECONDS = 30
CRAWL_TIMEOUT_SECONDS = int(os.getenv("CRAWL_TIMEOUT_SECONDS", "600"))


async def keep_lease(db: Database, capture: Capture, lost: asyncio.Event) -> None:
    assert capture.lease_token is not None

    while True:
        await asyncio.sleep(HEARTBEAT_SECONDS)

        try:
            renewed = await db.renew_capture_lease(
                capture._id, capture.lease_token, LEASE_SECONDS
            )
        except Exception:
            logger.exception("Failed to renew lease for capture %s", capture._id)
            lost.set()
            return

        if not renewed:
            lost.set()
            return


async def process_capture(db: Database, crawler: Crawler, capture: Capture) -> None:
    assert capture.lease_token is not None

    lost = asyncio.Event()
    heartbeat = asyncio.create_task(keep_lease(db, capture, lost))
    file_id: str | None = None

    try:
        logger.info(
            "Starting capture id=%s url=%s attempt=%s",
            capture._id,
            capture.url,
            capture.attempts,
        )

        # Separate output paths prevent retries from overwriting one another.
        fname = f"{capture._id}-{capture.attempts}"

        path = await asyncio.to_thread(
            crawler.generate_wacz,
            fname,
            capture.url,
            capture.depth,
            capture.limit,
            CRAWL_TIMEOUT_SECONDS,
        )

        if lost.is_set():
            raise RuntimeError("Capture lease lost")

        file_id = await db.save_archive(capture._id, path)

        if lost.is_set():
            raise RuntimeError("Capture lease lost")

        await db.complete_capture(capture._id, file_id, capture.lease_token)
        file_id = None

        logger.info("Completed capture id=%s", capture._id)

    except Exception as exc:
        logger.exception("Failed to process capture %s", capture._id)

        if file_id is not None:
            await db.delete_archive(file_id)

        try:
            await db.fail_capture(
                capture._id,
                str(exc),
                lease_token=capture.lease_token,
                max_attempts=MAX_ATTEMPTS,
                retry_delay_seconds=RETRY_SECONDS * (2 ** (capture.attempts - 1)),
            )
        except RuntimeError:
            logger.warning("Cannot update capture %s: lease lost", capture._id)

    finally:
        heartbeat.cancel()
        await asyncio.gather(heartbeat, return_exceptions=True)


async def worker(db: Database, crawler: Crawler) -> None:
    while True:
        capture = await db.claim_next_capture(
            lease_seconds=LEASE_SECONDS,
            max_attempts=MAX_ATTEMPTS,
        )

        if capture is None:
            await asyncio.sleep(POLL_SECONDS)
            continue

        await process_capture(db, crawler, capture)


async def main() -> None:
    mongo_client = get_mongo_client()
    docker_client = get_docker_client()

    try:
        db = get_mongo_database(mongo_client)
        crawler = get_browsertrix_crawler(docker_client)

        await worker(db, crawler)

    finally:
        await mongo_client.close()
        docker_client.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(main())
