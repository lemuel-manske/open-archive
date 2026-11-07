from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest

import app.application as oa
from app.infra.mongo import MongoDatabase, get_mongo_client


@pytest.mark.asyncio
async def test_capture_retries_after_failure():
    client = get_mongo_client()
    name = f"open-archive-test-{uuid4()}"

    try:
        db = MongoDatabase(client, name)
        app = oa.init_app(db=db)
        capture = await oa.request_capture(app, "https://example.org/", 0, 1)

        first = await db.claim_next_capture()
        assert first is not None
        assert first.attempts == 1
        assert first.lease_token is not None

        await db.fail_capture(
            capture._id, "Temporary failure",
            lease_token=first.lease_token, retry_delay_seconds=30,
        )

        pending = await db.get_capture(capture._id)
        assert pending is not None
        assert pending.status == "pending"
        assert pending.next_attempt_at is not None
        assert await db.claim_next_capture() is None

        await db.captures.update_one(
            {"_id": capture._id},
            {"$set": {"next_attempt_at": datetime.now(timezone.utc) - timedelta(seconds=1)}},
        )

        second = await db.claim_next_capture()
        assert second is not None
        assert second.attempts == 2
        assert second.lease_token != first.lease_token

        assert not await db.renew_capture_lease(capture._id, first.lease_token, 120)

        with pytest.raises(RuntimeError):
            await db.complete_capture(capture._id, str(uuid4()), first.lease_token)

        assert await db.renew_capture_lease(capture._id, second.lease_token, 120)

    finally:
        await client.drop_database(name)
        await client.close()


@pytest.mark.asyncio
async def test_expired_lease_can_be_reclaimed():
    client = get_mongo_client()
    name = f"open-archive-test-{uuid4()}"

    try:
        db = MongoDatabase(client, name)
        app = oa.init_app(db=db)
        capture = await oa.request_capture(app, "https://example.org/", 0, 1)

        first = await db.claim_next_capture()
        assert first is not None

        await db.captures.update_one(
            {"_id": capture._id},
            {"$set": {"lease_expires_at": datetime.now(timezone.utc) - timedelta(seconds=1)}},
        )

        second = await db.claim_next_capture()
        assert second is not None
        assert second.attempts == 2
        assert second.lease_token != first.lease_token

    finally:
        await client.drop_database(name)
        await client.close()


@pytest.mark.asyncio
async def test_failed_after_max_attempts():
    client = get_mongo_client()
    name = f"open-archive-test-{uuid4()}"

    try:
        db = MongoDatabase(client, name)
        app = oa.init_app(db=db)
        capture = await oa.request_capture(app, "https://example.org/", 0, 1)

        for attempt in range(1, 4):
            current = await db.claim_next_capture()
            assert current is not None
            assert current.attempts == attempt
            assert current.lease_token is not None

            await db.fail_capture(
                capture._id, "Unreachable",
                lease_token=current.lease_token,
                max_attempts=3,
                retry_delay_seconds=0,
            )

        result = await db.get_capture(capture._id)
        assert result is not None
        assert result.status == "failed"
        assert result.attempts == 3
        assert await db.claim_next_capture() is None

    finally:
        await client.drop_database(name)
        await client.close()
