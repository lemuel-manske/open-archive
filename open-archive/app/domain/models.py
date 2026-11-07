from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal
from uuid import uuid4

CaptureStatus = Literal["pending", "running", "completed", "failed"]


def new_capture_id() -> str:
    return str(uuid4())


@dataclass
class Capture:
    url: str
    depth: int
    limit: int

    status: CaptureStatus

    created_at: datetime

    archive_file_id: str | None = None

    error: str | None = None

    _id: str = field(
        default_factory=new_capture_id, init=True
    )  # allow setting _id on creation, but not on update

    attempts: int = 0
    started_at: datetime | None = None
    completed_at: datetime | None = None
