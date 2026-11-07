from pathlib import Path
import urllib.parse

from docker import DockerClient

from app.protocols import CRAWLS_PATH, CRAWLS_VOLUME, Crawler

IMAGE = "webrecorder/browsertrix-crawler"


def get_browsertrix_crawler(docker_client: DockerClient) -> Crawler:
    return BrowsertrixCrawler(docker_client)


class WACZNameGenerator:
    """
    Generates WACZ file names based on the URL.
    """

    def __init__(self):
        self.curr = 0

    def next(self) -> int:
        self.curr += 1
        return self.curr

    def generate_wacz_name(self, url: str) -> str:
        parsed_url = urllib.parse.urlparse(url)
        domain = parsed_url.netloc.replace(".", "_")
        path = parsed_url.path.strip("/").replace("/", "_")

        if not path:
            path = "root"

        return f"{domain}_{path}_{self.next()}"


class BrowsertrixCrawler(Crawler):
    """
    Browsertrix crawler implementation.
    """

    def __init__(self, docker_client: DockerClient):
        self.docker_client = docker_client

        self.wacz_name_generator = WACZNameGenerator()

    def generate_wacz(self, url: str, depth: int = 1, limit: int = 20) -> Path:
        name = self.wacz_name_generator.generate_wacz_name(url)

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
            name,
        ]

        self.docker_client.containers.run(
            image=IMAGE,
            command=cmd,
            volumes={CRAWLS_VOLUME: {"bind": "/crawls", "mode": "rw"}},
            detach=False,
            remove=True,
        )

        return CRAWLS_PATH / "collections" / name / f"{name}.wacz"
