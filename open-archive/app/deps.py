from contextvars import ContextVar

import docker as docker_sdk

import app.browsertrix as browsertrix
import app.docker as docker
import app.mongo as mongo
import app.protocols as protocols

docker_client: ContextVar[docker_sdk.DockerClient] = ContextVar(
    "docker_client", default=docker.get_docker_client()
)

browsertrix_crawler: ContextVar[protocols.Crawler] = ContextVar(
    "browsertrix_crawler", default=browsertrix.get_browsertrix_crawler(docker_client.get())
)

mongo_db: ContextVar[protocols.Database] = ContextVar(
    "mongo_db", default=mongo.get_mongo_database(mongo.get_mongo_client())
)
