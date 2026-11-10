import asyncio
import logging
import time

from backend.domain.protocols import CRAWLS_VOLUME, PROFILES_PATH, LoginSessions, Profiles
from backend.infra.browsertrix import IMAGE
from docker import DockerClient

logger = logging.getLogger(__name__)

LOGIN_TIMEOUT_SECONDS = 15 * 60
POLL_SECONDS = 2


async def process_login(
    sessions: LoginSessions,
    profiles: Profiles,
    docker_client: DockerClient,
    session: dict,
) -> None:
    session_id = session["_id"]

    path = PROFILES_PATH / f"{session_id}.tar.gz"

    container = None

    try:
        if await sessions.cancelled(session_id):
            raise RuntimeError("Login session cancelled")

        cmd = [
            "create-login-profile",
            "--url",
            session["url"],
            "--filename",
            f"/crawls/profiles/{path.name}",
        ]

        container = await asyncio.to_thread(
            docker_client.containers.run,
            image=IMAGE,
            command=cmd,
            volumes={CRAWLS_VOLUME: {"bind": "/crawls", "mode": "rw"}},
            ports={
                "9223/tcp": ("127.0.0.1", 9223),
                "6080/tcp": ("127.0.0.1", 6080),
            },
            detach=True,
            stdin_open=True,
            tty=True,
            remove=False,
            labels={
                "openarchive.login": "true",
                "openarchive.session": session_id,
            },
        )

        await sessions.running(session_id)
        logger.info("Login browser started session=%s", session_id)
        deadline = time.monotonic() + LOGIN_TIMEOUT_SECONDS

        while True:
            if await sessions.cancelled(session_id):
                raise RuntimeError("Login session cancelled")

            await asyncio.to_thread(container.reload)

            if container.status in ("exited", "dead"):
                result = await asyncio.to_thread(container.wait, timeout=15)
                if result["StatusCode"] != 0:
                    raise RuntimeError("Browser profile creation failed")
                break

            if time.monotonic() >= deadline:
                raise TimeoutError("Login session expired")

            await asyncio.sleep(POLL_SECONDS)

        if not path.is_file():
            raise FileNotFoundError("Browser profile was not created")

        if await sessions.cancelled(session_id):
            raise RuntimeError("Login session cancelled")

        data = await asyncio.to_thread(path.read_bytes)
        profile = await profiles.save(session["name"], session["url"], data)

        if await sessions.cancelled(session_id):
            await profiles.delete(profile._id)
            raise RuntimeError("Login session cancelled")

        await sessions.finish(session_id, profile_id=profile._id)
        logger.info("Browser profile saved session=%s", session_id)

    except TimeoutError:
        logger.warning("Browser login timed out session=%s", session_id)

        await sessions.finish(session_id, error="Login session expired")
    except Exception:
        logger.exception("Browser login failed session=%s", session_id)

        await sessions.finish(session_id, error="Could not create login profile")

    finally:
        if container is not None:
            try:
                await asyncio.to_thread(container.remove, force=True)
            except Exception:
                logger.exception("Could not remove login container session=%s", session_id)

        path.unlink(missing_ok=True)


async def login_worker(
    sessions: LoginSessions, profiles: Profiles, docker_client: DockerClient
) -> None:
    await sessions.recover()

    containers = await asyncio.to_thread(
        docker_client.containers.list, all=True, filters={"label": "openarchive.login=true"}
    )
    for container in containers:
        await asyncio.to_thread(container.remove, force=True)

    while True:
        session = await sessions.claim()

        if session is None:
            await asyncio.sleep(POLL_SECONDS)

            continue

        await process_login(sessions, profiles, docker_client, session)
