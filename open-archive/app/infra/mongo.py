from dataclasses import asdict
from datetime import datetime, timezone
import os
from pathlib import Path
from typing import AsyncIterator

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

    return AsyncMongoClient(uri)


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

    async def claim_next_capture(self) -> Capture | None:
        now = datetime.now(timezone.utc)

        doc = await self.captures.find_one_and_update(
            {
                "status": "pending",
            },
            {
                "$set": {
                    "status": "running",
                    "started_at": now,
                    "error": None,
                },
                "$inc": {
                    "attempts": 1,
                },
            },
            sort=[("created_at", 1)],
            return_document=ReturnDocument.AFTER,
        )

        return Capture(**doc) if doc else None

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

    async def complete_capture(self, capture_id: str, file_id: str) -> None:
        result = await self.captures.update_one(
            {"_id": capture_id, "status": "running"},
            {
                "$set": {
                    "status": "completed",
                    "archive_file_id": file_id,
                    "error": None,
                }
            },
        )

        if result.matched_count == 0:
            raise LookupError(capture_id)

    async def fail_capture(self, capture_id: str, error: str) -> None:
        result = await self.captures.update_one(
            {"_id": capture_id},
            {
                "$set": {
                    "status": "failed",
                    "error": error,
                }
            },
        )

        if result.matched_count == 0:
            raise LookupError(capture_id)
