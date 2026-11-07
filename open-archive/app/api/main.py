from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

import app.application as oa
from app.infra.mongo import get_mongo_client, get_mongo_database

from . import router


@asynccontextmanager
async def lifespan(api: FastAPI) -> AsyncGenerator[None, None]:
    mongo_client = get_mongo_client()

    try:
        api.state.application = oa.init_app(
            db=get_mongo_database(mongo_client),
        )

        yield
    finally:
        await mongo_client.close()


api = FastAPI(
    title="Open Archive",
    lifespan=lifespan,
)

api.include_router(router)


@api.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
