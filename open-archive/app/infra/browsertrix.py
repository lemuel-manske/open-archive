from pathlib import Path

from app.domain.protocols import CRAWLS_PATH, CRAWLS_VOLUME, Crawler
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

    def generate_wacz(self, fname: str, url: str, depth: int = 1, limit: int = 20) -> Path:
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

        self.docker_client.containers.run(
            image=IMAGE,
            command=cmd,
            volumes={CRAWLS_VOLUME: {"bind": "/crawls", "mode": "rw"}},
            detach=False,
            remove=True,
        )

        path = CRAWLS_PATH / "collections" / fname / f"{fname}.wacz"

        if not path.is_file():
            raise FileNotFoundError(f"WACZ file not found at {path}")

        return path
