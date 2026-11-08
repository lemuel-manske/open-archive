import asyncio
import logging

from app.domain.protocols import COLLECTIONS_PATH, PROFILES_PATH
from app.infra.browsertrix import get_browsertrix_crawler
from app.infra.docker import get_docker_client
from app.infra.mongo import (
    get_captures_store,
    get_login_sessions_store,
    get_mongo_client,
    get_profile_store,
)

from .login_worker import login_worker
from .process_capture_worker import process_captures_worker


async def main() -> None:
    PROFILES_PATH.mkdir(parents=True, exist_ok=True)
    COLLECTIONS_PATH.mkdir(parents=True, exist_ok=True)

    mongo_client = get_mongo_client()
    docker_client = get_docker_client()

    try:
        captures = get_captures_store(mongo_client)
        profiles = get_profile_store(mongo_client)
        sessions = get_login_sessions_store(mongo_client)

        crawler = get_browsertrix_crawler(docker_client)

        await sessions.ensure_indexes()

        await asyncio.gather(
            login_worker(sessions, profiles, docker_client),
            process_captures_worker(captures, crawler, profiles),
        )

    finally:
        await mongo_client.close()
        docker_client.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    asyncio.run(main())
