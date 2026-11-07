import asyncio
import logging

from app.domain.protocols import Crawler, Database
from app.infra.browsertrix import get_browsertrix_crawler
from app.infra.docker import get_docker_client
from app.infra.mongo import get_mongo_client, get_mongo_database


logger = logging.getLogger(__name__)


async def worker(db: Database, crawler: Crawler) -> None:
    while True:
        capture = await db.claim_next_capture()

        if capture is None:
            await asyncio.sleep(2)
            continue

        try:
            path = await asyncio.to_thread(
                crawler.generate_wacz,
                capture._id,
                capture.url,
                capture.depth,
                capture.limit,
            )

            file_id = await db.save_archive(capture._id, path)

            await db.complete_capture(capture._id, file_id)

        except Exception as exc:
            logger.exception(
                "Failed to process capture %s",
                capture._id,
            )

            await db.fail_capture(capture._id, str(exc))


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
