from dataclasses import asdict
import re
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import AnyHttpUrl, BaseModel, Field

import backend.application as oa
from backend.domain.models import LoginSession

capture_router = APIRouter(prefix="/captures", tags=["captures"])
login_router = APIRouter(tags=["browser profiles"])


def get_application(request: Request) -> oa.Application:
    return request.app.state.application


App = Annotated[oa.Application, Depends(get_application)]


def parse_range(value: str, size: int) -> tuple[int, int]:
    match = re.fullmatch(r"bytes=(\d*)-(\d*)", value)

    if not match or size <= 0:
        raise ValueError("Invalid range")

    first, last = match.groups()

    if not first and not last:
        raise ValueError("Invalid range")

    if not first:
        count = int(last)

        if count <= 0:
            raise ValueError("Invalid range")

        start = max(0, size - count)
        end = size - 1
    else:
        start = int(first)
        end = int(last) if last else size - 1
        end = min(end, size - 1)

    if start >= size or start > end:
        raise ValueError("Unsatisfiable range")

    return start, end


class CaptureRequest(BaseModel):
    url: str

    depth: int = Field(default=1, ge=0, le=5)
    limit: int = Field(default=20, ge=1, le=100)

    profile_id: str | None = None


class LoginRequest(BaseModel):
    url: AnyHttpUrl


def login_session_response(session: LoginSession) -> dict:
    return {
        **asdict(session),
        "browser_url": "http://localhost:9223/" if session.status == "running" else None,
    }


@capture_router.get(
    "", response_model=list[oa.Capture], response_model_exclude={"__all__": {"lease_token"}}
)
async def list_captures(
    app: App, limit: int = Query(default=12, ge=1, le=100), skip: int = Query(default=0, ge=0)
):
    return await oa.list_captures(app, limit=limit, skip=skip)


@capture_router.get("/{capture_id}/archive")
async def download_archive(
    capture_id: str,
    request: Request,
    app: App,
):
    capture = await oa.get_capture(app, capture_id)

    if capture is None:
        raise HTTPException(404, "Capture not found")

    if capture.status != "completed" or not capture.archive_file_id:
        raise HTTPException(409, "Archive not available")

    size = await app.captures.get_archive_size(capture.archive_file_id)

    range_header = request.headers.get("range")

    headers = {
        "Accept-Ranges": "bytes",
        "Content-Disposition": (f'inline; filename="{capture_id}.wacz"'),
        "Cache-Control": "no-transform",
    }

    if range_header is None:
        headers["Content-Length"] = str(size)

        return StreamingResponse(
            oa.stream_capture_archive(app, capture_id),
            media_type="application/wacz+zip",
            headers=headers,
        )

    try:
        start, end = parse_range(range_header, size)
    except ValueError:
        return StreamingResponse(
            iter(()),
            status_code=416,
            headers={
                "Content-Range": f"bytes */{size}",
                "Accept-Ranges": "bytes",
            },
        )

    headers["Content-Range"] = f"bytes {start}-{end}/{size}"
    headers["Content-Length"] = str(end - start + 1)

    return StreamingResponse(
        oa.stream_capture_archive(
            app,
            capture_id,
            start=start,
            end=end,
        ),
        status_code=206,
        media_type="application/wacz+zip",
        headers=headers,
    )


@capture_router.post("", status_code=202)
async def create_capture(data: CaptureRequest, app: App):
    if data.profile_id is not None and not await app.profiles.exists(data.profile_id):
        raise HTTPException(status_code=422, detail="Browser profile not found")

    capture = await oa.create_capture(
        app,
        url=data.url,
        depth=data.depth,
        limit=data.limit,
        profile_id=data.profile_id,
    )

    return {
        "id": capture._id,
        "status": capture.status,
    }


@capture_router.delete("/{capture_id}", status_code=204)
async def delete_capture(capture_id: str, app: App):
    try:
        deleted = await oa.delete_capture(app, capture_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    if not deleted:
        raise HTTPException(status_code=404, detail="Capture not found")


@capture_router.get(
    "/{capture_id}", response_model=oa.Capture, response_model_exclude={"lease_token"}
)
async def get_capture(capture_id: str, app: App):
    capture = await oa.get_capture(app, capture_id)

    if capture is None:
        raise HTTPException(status_code=404, detail="Capture not found")

    return capture


@login_router.post("/login-sessions", status_code=202)
async def start_login(data: LoginRequest, app: App):
    try:
        session = await app.login_sessions.create(str(data.url), "oa-session")
        return login_session_response(session)
    except RuntimeError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc


@login_router.get("/login-sessions/{session_id}")
async def get_login(session_id: str, app: App):
    session = await app.login_sessions.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Login session not found")
    return login_session_response(session)


@login_router.delete("/login-sessions/{session_id}", status_code=204)
async def cancel_login(session_id: str, app: App):
    if not await app.login_sessions.cancel(session_id):
        raise HTTPException(status_code=404, detail="Active login session not found")


@login_router.get("/profiles")
async def list_profiles(app: App):
    return await app.profiles.list()


@login_router.delete("/profiles/{profile_id}", status_code=204)
async def delete_profile(profile_id: str, app: App):
    try:
        deleted = await app.profiles.delete(profile_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc

    if not deleted:
        raise HTTPException(status_code=404, detail="Browser profile not found")
