from contextvars import ContextVar

import docker as docker_sdk

import app.browsertrix as browsertrix
import app.crawler as crawler
import app.docker as docker


docker_client: ContextVar[docker_sdk.DockerClient] = ContextVar(
    "docker_client",
    default=docker.get_docker_client()
)

browsertrix_crawler: ContextVar[crawler.Crawler] = ContextVar(
    "browsertrix_crawler",
    default=browsertrix.get_browsertrix_crawler(docker_client.get())
)
