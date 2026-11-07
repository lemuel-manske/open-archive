from pathlib import Path

from docker import DockerClient

from app.protocols import CRAWLS_PATH, CRAWLS_VOLUME, Crawler

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

        path =  CRAWLS_PATH / "collections" / fname / f"{fname}.wacz"

        assert path.is_file(), f"WACZ file not found at {path}"

        return path
