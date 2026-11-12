from dataclasses import asdict
from datetime import datetime, timedelta, timezone
import io
import os
from pathlib import Path
import tarfile
from typing import Any, AsyncIterator
from uuid import uuid4

from bson.objectid import ObjectId
from cryptography.fernet import Fernet
from gridfs import AsyncGridFSBucket
from pymongo import AsyncMongoClient, ReturnDocument
from pymongo.errors import DuplicateKeyError

from backend.domain.models import Capture, LoginSession, Profile
from backend.domain.protocols import Captures, LoginSessions, Profiles

MAX_PROFILE_SIZE = 100 * 1024 * 1024


def get_mongo_client() -> AsyncMongoClient:
    uri = os.environ.get("MONGO_URI")

    assert uri is not None, "MONGO_URI environment variable is not set"

    return AsyncMongoClient(uri, tz_aware=True)


def get_captures_store(client: AsyncMongoClient, db_name: str = "open-archive") -> Captures:
    return CapturesDB(client, db_name)


def get_login_sessions_store(
    client: AsyncMongoClient, db_name: str = "open-archive"
) -> LoginSessions:
    return LoginSessionsDB(client, db_name)


def get_profile_store(client: AsyncMongoClient, db_name: str = "open-archive") -> Profiles:
    return ProfilesDB(client, db_name)


class CapturesDB(Captures):
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

    async def list(self, limit: int = 12, skip: int = 0) -> list[Capture]:
        cursor = self.captures.find().sort("created_at", -1).skip(skip).limit(limit)

        return [Capture(**doc) async for doc in cursor]

    async def claim_next(self, lease_seconds: int = 120, max_attempts: int = 3) -> Capture | None:
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

    async def renew_lease(self, capture_id: str, lease_token: str, lease_seconds: int) -> bool:
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

    async def start(self, capture_id: str) -> None:
        result = await self.captures.update_one(
            {"_id": capture_id, "status": "pending"},
            {"$set": {"status": "running"}},
        )

        if result.modified_count != 1:
            raise RuntimeError("Capture is not pending")

    async def save(
        self, url: str, depth: int, limit: int, profile_id: str | None = None
    ) -> Capture:
        capture = Capture(
            url=url,
            depth=depth,
            limit=limit,
            profile_id=profile_id,
            created_at=datetime.now(timezone.utc),
        )

        doc = asdict(capture)
        doc["_id"] = doc.pop("_id")

        await self.captures.insert_one(doc)

        return capture

    async def get(self, capture_id: str) -> Capture | None:
        doc = await self.captures.find_one({"_id": capture_id})

        if doc is None:
            return None

        doc["_id"] = doc.pop("_id")
        return Capture(**doc)

    async def delete(self, capture_id: str) -> bool:
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

    async def complete(self, capture_id: str, file_id: str, lease_token: str | None = None) -> None:
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

    async def fail(
        self,
        capture_id: str,
        error: str,
        lease_token: str | None = None,
        max_attempts: int = 3,
        retry_delay_seconds: int = 30,
    ) -> None:
        now = datetime.now(timezone.utc)
        query: dict[str, Any] = {"_id": capture_id}
        if lease_token is not None:
            query.update(
                {
                    "status": "running",
                    "lease_token": lease_token,
                    "lease_expires_at": {"$gt": now},
                }
            )

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


class LoginSessionsDB(LoginSessions):
    def __init__(self, client: AsyncMongoClient, db_name: str):
        self.sessions = client[db_name]["login_sessions"]

    async def ensure_indexes(self) -> None:
        await self.sessions.create_index(
            "active",
            unique=True,
            partialFilterExpression={"active": True},
        )

    async def create(self, url: str, name: str) -> LoginSession:
        ls = LoginSession(
            url=url,
            name=name,
            created_at=datetime.now(timezone.utc),
        )

        doc = asdict(ls)

        try:
            await self.sessions.insert_one(doc)
        except DuplicateKeyError as exc:
            raise RuntimeError("Another login session is already active") from exc

        return ls

    async def get(self, session_id: str) -> LoginSession | None:
        doc = await self.sessions.find_one({"_id": session_id})

        return LoginSession(**doc) if doc else None

    async def claim(self) -> dict | None:
        return await self.sessions.find_one_and_update(
            {"status": "pending", "active": True},
            {"$set": {"status": "starting"}},
            return_document=ReturnDocument.AFTER,
        )

    async def running(self, session_id: str) -> None:
        await self.sessions.update_one(
            {"_id": session_id, "status": "starting"},
            {"$set": {"status": "running"}},
        )

    async def finish(
        self, session_id: str, profile_id: str | None = None, error: str | None = None
    ) -> None:
        result = await self.sessions.update_one(
            {"_id": session_id, "status": {"$ne": "cancelling"}},
            {
                "$set": {
                    "status": "completed" if profile_id else "failed",
                    "profile_id": profile_id,
                    "error": error,
                    "active": False,
                }
            },
        )
        if result.matched_count == 0:
            await self.sessions.update_one(
                {"_id": session_id, "status": "cancelling"},
                {"$set": {"status": "cancelled", "active": False}},
            )

    async def cancel(self, session_id: str) -> bool:
        pending = await self.sessions.find_one_and_update(
            {"_id": session_id, "status": "pending", "active": True},
            {"$set": {"status": "cancelled", "active": False}},
            return_document=ReturnDocument.AFTER,
        )

        if pending is not None:
            return True

        result = await self.sessions.update_one(
            {"_id": session_id, "status": {"$in": ["starting", "running"]}, "active": True},
            {"$set": {"status": "cancelling"}},
        )
        return result.matched_count == 1

    async def cancelled(self, session_id: str) -> bool:
        return await self.sessions.find_one({"_id": session_id, "status": "cancelling"}) is not None

    async def recover(self) -> None:
        await self.sessions.update_many(
            {"status": {"$in": ["starting", "running", "cancelling"]}},
            {
                "$set": {
                    "status": "failed",
                    "error": "Login session interrupted; start a new session",
                    "active": False,
                }
            },
        )


class ProfilesDB(Profiles):
    def __init__(self, client: AsyncMongoClient, db_name: str):
        self.db = client[db_name]

        self.profiles = self.db["profiles"]
        self.captures = self.db["captures"]

        self.client = client

        self.files = AsyncGridFSBucket(self.db)

        key = os.environ.get("OPENARCHIVE_PROFILE_KEY")

        assert key is not None, "OPENARCHIVE_PROFILE_KEY environment variable is not set"

        self.cipher = Fernet(key.encode())

    async def save(self, name: str, url: str, data: bytes) -> Profile:
        if not data or len(data) > MAX_PROFILE_SIZE:
            raise ValueError("Invalid browser profile size")

        try:
            with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as archive:
                members = archive.getmembers()

                if not members or len(members) > 10000:
                    raise ValueError("Invalid browser profile")

                size = 0
                for member in members:
                    parts = member.name.split("/")
                    if (
                        member.name.startswith("/")
                        or ".." in parts
                        or not (member.isfile() or member.isdir())
                    ):
                        raise ValueError("Unsafe browser profile")

                    size += member.size
                    if size > MAX_PROFILE_SIZE * 3:
                        raise ValueError("Browser profile exceeds maximum unpacked size")
        except (tarfile.TarError, OSError, EOFError) as exc:
            raise ValueError("Invalid browser profile") from exc

        profile_id = str(uuid4())
        file_id = await self.files.upload_from_stream(
            f"{profile_id}.encrypted",
            io.BytesIO(self.cipher.encrypt(data)),
            metadata={"profile_id": profile_id},
        )

        created_at = datetime.now(timezone.utc)

        document = {
            "_id": profile_id,
            "name": name,
            "url": url,
            "created_at": created_at,
            "file_id": str(file_id),
        }

        try:
            await self.profiles.insert_one(document)
        except Exception:
            await self.files.delete(file_id)
            raise

        return Profile(
            _id=profile_id,
            name=name,
            url=url,
            created_at=created_at,
        )

    async def list(self) -> list[Profile]:
        cursor = self.profiles.find().sort("created_at", -1)

        return [
            Profile(
                _id=doc["_id"],
                name=doc["name"],
                url=doc["url"],
                created_at=doc["created_at"],
            )
            async for doc in cursor
        ]

    async def exists(self, profile_id: str) -> bool:
        return await self.profiles.find_one({"_id": profile_id}) is not None

    async def load(self, profile_id: str) -> bytes:
        document = await self.profiles.find_one({"_id": profile_id})
        if document is None:
            raise LookupError("Browser profile not found")

        stream = await self.files.open_download_stream(ObjectId(document["file_id"]))
        try:
            encrypted = await stream.read()
        finally:
            await stream.close()

        return self.cipher.decrypt(encrypted)

    async def delete(self, profile_id: str) -> bool:
        in_use = await self.captures.find_one(
            {
                "profile_id": profile_id,
                "status": {"$in": ["pending", "running"]},
            }
        )
        if in_use:
            raise RuntimeError("Profile is used by an active capture")

        document = await self.profiles.find_one_and_delete({"_id": profile_id})
        if document is None:
            return False

        await self.files.delete(ObjectId(document["file_id"]))
        return True
