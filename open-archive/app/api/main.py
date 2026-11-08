from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI

import app.application as oa
from app.infra.mongo import (
    get_captures_store,
    get_login_sessions_store,
    get_mongo_client,
    get_profile_store,
)

from . import capture_router, login_router


@asynccontextmanager
async def lifespan(api: FastAPI) -> AsyncGenerator[None, None]:
    mongo_client = get_mongo_client()

    try:
        ls = get_login_sessions_store(mongo_client)

        await ls.ensure_indexes()

        api.state.application = oa.init_app(
            captures=get_captures_store(mongo_client),
            login_sessions=ls,
            profiles=get_profile_store(mongo_client),
        )

        yield
    finally:
        await mongo_client.close()


api = FastAPI(
    title="OpenArchive",
    lifespan=lifespan,
)

api.include_router(capture_router)
api.include_router(login_router)


@api.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}
