from dataclasses import asdict
from datetime import datetime, timedelta, timezone
import os
from uuid import uuid4
from pathlib import Path
from typing import Any, AsyncIterator

from app.domain.models import Capture
from app.domain.protocols import Database
from bson.objectid import ObjectId
from gridfs import AsyncGridFSBucket
from pymongo import AsyncMongoClient, ReturnDocument


def get_mongo_database(client: AsyncMongoClient, db_name: str = "open-archive") -> Database:
    return MongoDatabase(client, db_name)


def get_mongo_client() -> AsyncMongoClient:
    uri = os.environ.get("MONGO_URI")

    assert uri is not None, "MONGO_URI environment variable is not set"

    return AsyncMongoClient(uri, tz_aware=True)


class MongoDatabase(Database):
    """
    MongoDB implementation of the Database contract.
    """

    def __init__(self, client: AsyncMongoClient, db_name: str):
        self.client = client

        self.db = client[db_name]

        self.captures = self.db["captures"]
        self.files = AsyncGridFSBucket(self.db)

    async def get_archive_size(self, file_id: str) -> int:
        stream = await self.files.open_download_stream(ObjectId(file_id))
        try:
            return stream.length
        finally:
            await stream.close()

    async def stream_archive(
        self,
        file_id: str,
        start: int = 0,
        end: int | None = None,
    ) -> AsyncIterator[bytes]:
        stream = await self.files.open_download_stream(ObjectId(file_id))

        try:
            await stream.seek(start)

            remaining = stream.length - start if end is None else end - start + 1

            while remaining > 0:
                chunk = await stream.read(min(256 * 1024, remaining))

                if not chunk:
                    break

                yield chunk
                remaining -= len(chunk)
        finally:
            await stream.close()

    async def list_captures(self, limit: int = 12, skip: int = 0) -> list[Capture]:
        cursor = self.captures.find().sort("created_at", -1).skip(skip).limit(limit)

        return [Capture(**doc) async for doc in cursor]

    async def claim_next_capture(
        self, lease_seconds: int = 120, max_attempts: int = 3
    ) -> Capture | None:
        now = datetime.now(timezone.utc)
        expired = {"status": "running", "lease_expires_at": {"$lte": now}}

        await self.captures.update_many(
            {
                "attempts": {"$gte": max_attempts},
                "$or": [expired, {"status": "pending"}],
            },
            {
                "$set": {
                    "status": "failed",
                    "error": "Capture exceeded maximum attempts",
                    "completed_at": now,
                },
                "$unset": {"lease_token": "", "lease_expires_at": "", "next_attempt_at": ""},
            },
        )

        doc = await self.captures.find_one_and_update(
            {
                "attempts": {"$lt": max_attempts},
                "$or": [
                    {
                        "status": "pending",
                        "$or": [
                            {"next_attempt_at": None},
                            {"next_attempt_at": {"$lte": now}},
                        ],
                    },
                    expired,
                ],
            },
            {
                "$set": {
                    "status": "running",
                    "started_at": now,
                    "completed_at": None,
                    "error": None,
                    "lease_token": str(uuid4()),
                    "lease_expires_at": now + timedelta(seconds=lease_seconds),
                    "next_attempt_at": None,
                },
                "$inc": {"attempts": 1},
            },
            sort=[("created_at", 1)],
            return_document=ReturnDocument.AFTER,
        )

        return Capture(**doc) if doc else None

    async def renew_capture_lease(
        self, capture_id: str, lease_token: str, lease_seconds: int
    ) -> bool:
        now = datetime.now(timezone.utc)
        result = await self.captures.update_one(
            {
                "_id": capture_id,
                "status": "running",
                "lease_token": lease_token,
                "lease_expires_at": {"$gt": now},
            },
            {"$set": {"lease_expires_at": now + timedelta(seconds=lease_seconds)}},
        )

        return result.matched_count == 1

    async def start_capture(self, capture_id: str) -> None:
        result = await self.captures.update_one(
            {"_id": capture_id, "status": "pending"},
            {"$set": {"status": "running"}},
        )

        if result.modified_count != 1:
            raise RuntimeError("Capture is not pending")

    async def create_capture(self, capture: Capture) -> None:
        doc = asdict(capture)
        doc["_id"] = doc.pop("_id")

        await self.captures.insert_one(doc)

    async def get_capture(self, capture_id: str) -> Capture | None:
        doc = await self.captures.find_one({"_id": capture_id})

        if doc is None:
            return None

        doc["_id"] = doc.pop("_id")
        return Capture(**doc)

    async def delete_capture(self, capture_id: str) -> bool:
        capture = await self.captures.find_one_and_delete(
            {"_id": capture_id, "status": {"$in": ["pending", "completed", "failed"]}}
        )

        if capture is None:
            if await self.captures.find_one({"_id": capture_id}) is not None:
                raise RuntimeError("Cannot delete a running capture")
            return False

        if capture.get("archive_file_id"):
            await self.files.delete(ObjectId(capture["archive_file_id"]))

        return True

    async def save_archive(self, capture_id: str, file: Path) -> str:
        with file.open("rb") as stream:
            file_id = await self.files.upload_from_stream(
                file.name,
                stream,
                metadata={"capture_id": capture_id},
            )

        return str(file_id)

    async def delete_archive(self, file_id: str) -> None:
        await self.files.delete(ObjectId(file_id))

    async def complete_capture(
        self, capture_id: str, file_id: str, lease_token: str | None = None
    ) -> None:
        now = datetime.now(timezone.utc)
        query: dict[str, Any] = {"_id": capture_id, "status": "running"}
        if lease_token is not None:
            query["lease_token"] = lease_token
            query["lease_expires_at"] = {"$gt": now}

        result = await self.captures.update_one(
            query,
            {
                "$set": {
                    "status": "completed",
                    "completed_at": now,
                    "archive_file_id": file_id,
                    "error": None,
                },
                "$unset": {
                    "lease_token": "",
                    "lease_expires_at": "",
                    "next_attempt_at": "",
                },
            },
        )
        if result.matched_count != 1:
            raise RuntimeError("Capture lease lost or capture not running")

    async def fail_capture(
        self, capture_id: str, error: str, lease_token: str | None = None,
        max_attempts: int = 3, retry_delay_seconds: int = 30,
    ) -> None:
        now = datetime.now(timezone.utc)
        query: dict[str, Any] = {"_id": capture_id}
        if lease_token is not None:
            query.update({
                "status": "running",
                "lease_token": lease_token,
                "lease_expires_at": {"$gt": now},
            })

        capture = await self.captures.find_one(query)
        if capture is None:
            raise RuntimeError("Capture lease lost or capture not found")

        retry = lease_token is not None and capture.get("attempts", 0) < max_attempts
        result = await self.captures.update_one(
            query,
            {
                "$set": {
                    "status": "pending" if retry else "failed",
                    "error": error,
                    "completed_at": None if retry else now,
                    "next_attempt_at": (
                        now + timedelta(seconds=retry_delay_seconds) if retry else None
                    ),
                },
                "$unset": {"lease_token": "", "lease_expires_at": ""},
            },
        )
        if result.matched_count != 1:
            raise RuntimeError("Capture lease lost")
