from contextlib import asynccontextmanager
from typing import AsyncGenerator

import docker
from fastapi import FastAPI

import app.application as oa
from app.infra.browsertrix import get_browsertrix_crawler
from app.infra.mongo import get_mongo_client, get_mongo_database

from . import router


@asynccontextmanager
async def lifespan(api: FastAPI) -> AsyncGenerator[None, None]:
    mongo_client = get_mongo_client()
    docker_client = docker.from_env()

    api.state.application = oa.init_app(
        db=get_mongo_database(mongo_client),
        crawler=get_browsertrix_crawler(docker_client),
    )

    try:
        yield
    finally:
        await mongo_client.close()
        docker_client.close()


api = FastAPI(lifespan=lifespan)
api.include_router(router)
