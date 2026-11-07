from pathlib import Path
from uuid import uuid4

import pytest

import app.application as oa
from app.infra.mongo import get_mongo_client, get_mongo_database


@pytest.mark.asyncio
async def test_delete_capture_and_archive(tmp_path: Path):
    mongo = get_mongo_client()
    db_name = f"open-archive-test-{uuid4()}"

    try:
        db = get_mongo_database(mongo, db_name=db_name)
        app = oa.init_app(db=db)
        capture = await oa.request_capture(app, url="https://example.org/", depth=0, limit=1)
        archive = tmp_path / "test.wacz"
        archive.write_bytes(b"test archive")

        await db.start_capture(capture._id)
        file_id = await db.save_archive(capture._id, archive)
        await db.complete_capture(capture._id, file_id)

        assert await oa.delete_capture(app, capture._id) is True
        assert await oa.get_capture(app, capture._id) is None
        assert await oa.delete_capture(app, capture._id) is False

        from gridfs.errors import NoFile

        with pytest.raises(NoFile):
            await db.get_archive_size(file_id)
    finally:
        await mongo.drop_database(db_name)
        await mongo.close()


@pytest.mark.asyncio
async def test_running_capture_cannot_be_deleted():
    mongo = get_mongo_client()
    db_name = f"open-archive-test-{uuid4()}"

    try:
        db = get_mongo_database(mongo, db_name=db_name)
        app = oa.init_app(db=db)
        capture = await oa.request_capture(app, url="https://example.org/", depth=0, limit=1)
        await db.start_capture(capture._id)

        with pytest.raises(RuntimeError):
            await oa.delete_capture(app, capture._id)

        assert await oa.get_capture(app, capture._id) is not None
    finally:
        await mongo.drop_database(db_name)
        await mongo.close()


@pytest.mark.asyncio
async def test_deleting_one_version_preserves_the_other():
    mongo = get_mongo_client()
    db_name = f"open-archive-test-{uuid4()}"

    try:
        db = get_mongo_database(mongo, db_name=db_name)
        app = oa.init_app(db=db)
        url = "https://example.org/"

        first = await oa.request_capture(app, url=url, depth=0, limit=1)
        second = await oa.request_capture(app, url=url, depth=1, limit=10)

        assert first._id != second._id
        assert await oa.delete_capture(app, first._id) is True
        assert await oa.get_capture(app, first._id) is None
        assert await oa.get_capture(app, second._id) is not None
    finally:
        await mongo.drop_database(db_name)
        await mongo.close()
