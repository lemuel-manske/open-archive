import asyncio
import logging
import os
from pathlib import Path
from uuid import uuid4

from app.domain.models import Capture
from app.domain.protocols import PROFILES_PATH, Captures, Crawler, Profiles

logger = logging.getLogger(__name__)

HEARTBEAT_SECONDS = 30
LEASE_SECONDS = 120
MAX_ATTEMPTS = 3
POLL_SECONDS = 2
RETRY_SECONDS = 30

CRAWL_TIMEOUT_SECONDS = int(os.getenv("CRAWL_TIMEOUT_SECONDS", "600"))


async def keep_lease(db: Captures, capture: Capture, lost: asyncio.Event) -> None:
    assert capture.lease_token is not None

    while True:
        await asyncio.sleep(HEARTBEAT_SECONDS)

        try:
            renewed = await db.renew_lease(capture._id, capture.lease_token, LEASE_SECONDS)
        except Exception:
            logger.exception("Failed to renew lease for capture %s", capture._id)
            lost.set()
            return

        if not renewed:
            lost.set()
            return


async def process_capture(
    capture: Capture,
    profiles: Profiles,
    captures: Captures,
    crawler: Crawler,
) -> None:
    assert capture.lease_token is not None

    lost = asyncio.Event()

    heartbeat = asyncio.create_task(keep_lease(captures, capture, lost))

    file_id: str | None = None
    profile_path: Path | None = None

    try:
        logger.info(
            "Starting capture id=%s attempt=%s",
            capture._id,
            capture.attempts,
        )

        fname = f"{capture._id}-{capture.attempts}"

        if capture.profile_id is not None:
            data = await profiles.load(capture.profile_id)

            assert data is not None, f"Profile {capture.profile_id} not found"

            profile_path = PROFILES_PATH / f"{uuid4()}.tar.gz"

            with profile_path.open("xb") as output:
                profile_path.chmod(0o600)

                output.write(data)

            del data

        path = await asyncio.to_thread(
            crawler.generate_wacz,
            fname,
            capture.url,
            capture.depth,
            capture.limit,
            CRAWL_TIMEOUT_SECONDS,
            profile_path,
        )

        if lost.is_set():
            raise RuntimeError("Capture lease lost")

        file_id = await captures.save_archive(capture._id, path)

        if lost.is_set():
            raise RuntimeError("Capture lease lost")

        await captures.complete(capture._id, file_id, capture.lease_token)
        file_id = None

        logger.info("Completed capture id=%s", capture._id)

    except Exception as exc:
        if capture.profile_id:
            logger.error("Authenticated capture failed id=%s", capture._id)
            error = "Authenticated capture failed"
        else:
            logger.exception("Failed to process capture %s", capture._id)
            error = str(exc)

        if file_id is not None:
            await captures.delete_archive(file_id)

        try:
            await captures.fail(
                capture._id,
                error,
                lease_token=capture.lease_token,
                max_attempts=MAX_ATTEMPTS,
                retry_delay_seconds=RETRY_SECONDS * (2 ** (capture.attempts - 1)),
            )
        except RuntimeError:
            logger.warning("Cannot update capture %s: lease lost", capture._id)

    finally:
        if profile_path is not None:
            profile_path.unlink(missing_ok=True)

        heartbeat.cancel()

        await asyncio.gather(heartbeat, return_exceptions=True)


async def process_captures_worker(captures: Captures, crawler: Crawler, profiles: Profiles) -> None:
    while True:
        capture = await captures.claim_next(
            lease_seconds=LEASE_SECONDS,
            max_attempts=MAX_ATTEMPTS,
        )

        if capture is None:
            await asyncio.sleep(POLL_SECONDS)
            continue

        await process_capture(capture, profiles, captures, crawler)
