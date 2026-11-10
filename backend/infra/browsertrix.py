from pathlib import Path
import time

from backend.domain.protocols import CRAWLS_PATH, CRAWLS_VOLUME, Crawler
from docker import DockerClient

IMAGE = "webrecorder/browsertrix-crawler"


def get_browsertrix_crawler(docker_client: DockerClient) -> Crawler:
    return BrowsertrixCrawler(docker_client)


class BrowsertrixCrawler(Crawler):
    """
    Browsertrix crawler implementation.
    """

    def __init__(self, docker_client: DockerClient):
        self.docker_client = docker_client

    def generate_wacz(
        self,
        fname: str,
        url: str,
        depth: int = 1,
        limit: int = 20,
        timeout_seconds: int = 600,
        profile_path: Path | None = None,
    ) -> Path:
        cmd = [
            "crawl",
            "--url",
            url,
            "--depth",
            str(depth),
            "--limit",
            str(limit),
            "--generateWACZ",
            "--collection",
            fname,
        ]

        if profile_path is not None:
            cmd.extend(["--profile", f"/crawls/profiles/{profile_path.name}"])

        container = self.docker_client.containers.run(
            image=IMAGE,
            command=cmd,
            volumes={CRAWLS_VOLUME: {"bind": "/crawls", "mode": "rw"}},
            detach=True,
            remove=False,
            labels={"openarchive.crawler": "true"},
        )

        try:
            deadline = time.monotonic() + timeout_seconds

            while True:
                container.reload()

                if container.status in ("exited", "dead"):
                    result = container.wait(timeout=15)

                    if result["StatusCode"] != 0:
                        logs = container.logs(tail=30).decode("utf-8", errors="replace")
                        raise RuntimeError(f"Browsertrix exited with an error: {logs}")

                    break

                if time.monotonic() >= deadline:
                    raise TimeoutError(f"Browsertrix exceeded {timeout_seconds} seconds")

                time.sleep(2)

            path = CRAWLS_PATH / "collections" / fname / f"{fname}.wacz"

            if not path.is_file():
                raise FileNotFoundError(f"WACZ file not found at {path}")

            return path
        finally:
            container.remove(force=True)
