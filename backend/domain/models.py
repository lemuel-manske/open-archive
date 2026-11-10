from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal
from uuid import uuid4

CaptureStatus = Literal["pending", "running", "completed", "failed"]

LoginStatus = Literal[
    "pending",
    "starting",
    "running",
    "cancelling",
    "cancelled",
    "completed",
    "failed",
]


def new_id() -> str:
    return str(uuid4())


@dataclass
class Profile:
    name: str
    url: str

    created_at: datetime

    _id: str = field(default_factory=new_id, init=True)


@dataclass
class LoginSession:
    url: str
    name: str

    created_at: datetime

    _id: str = field(default_factory=new_id, init=True)

    status: LoginStatus = "pending"

    active: bool = True

    profile_id: str | None = None

    error: str | None = None


@dataclass
class Capture:
    url: str
    depth: int
    limit: int

    status: CaptureStatus

    created_at: datetime

    archive_file_id: str | None = None

    error: str | None = None
    profile_id: str | None = None

    _id: str = field(default_factory=new_id, init=True)

    attempts: int = 0

    started_at: datetime | None = None
    completed_at: datetime | None = None

    lease_token: str | None = None
    lease_expires_at: datetime | None = None

    next_attempt_at: datetime | None = None
