import re
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

import app.application as oa

router = APIRouter(prefix="/captures", tags=["captures"])


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


@router.get("", response_model=list[oa.Capture])
async def list_captures(
    app: App, limit: int = Query(default=12, ge=1, le=100), skip: int = Query(default=0, ge=0)
):
    return await oa.list_captures(app, limit=limit, skip=skip)


@router.get("/{capture_id}/archive")
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

    size = await app.db.get_archive_size(capture.archive_file_id)

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


@router.post("", status_code=202)
async def create_capture(data: CaptureRequest, app: App):
    capture = await oa.request_capture(
        app,
        url=data.url,
        depth=data.depth,
        limit=data.limit,
    )

    return {
        "id": capture._id,
        "status": capture.status,
    }


@router.get("/{capture_id}")
async def get_capture(capture_id: str, app: App):
    capture = await oa.get_capture(app, capture_id)

    if capture is None:
        raise HTTPException(status_code=404, detail="Capture not found")

    return capture
