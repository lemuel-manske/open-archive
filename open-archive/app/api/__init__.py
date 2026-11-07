from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

import app.application as oa

router = APIRouter(prefix="/captures", tags=["captures"])


def get_application(request: Request) -> oa.Application:
    return request.app.state.application


App = Annotated[oa.Application, Depends(get_application)]


class CaptureRequest(BaseModel):
    url: str
    depth: int = Field(default=1, ge=0, le=5)
    limit: int = Field(default=20, ge=1, le=100)


@router.get("", response_model=list[oa.Capture])
async def list_captures(
    app: App,
    limit: int = Query(default=12, ge=1, le=100),
    skip: int = Query(default=0, ge=0)
):
    return await oa.list_captures(app, limit=limit, skip=skip)


@router.get("/{capture_id}/archive")
async def download_archive(capture_id: str, app: App):
    capture = await oa.get_capture(app, capture_id)

    if capture is None:
        raise HTTPException(
            status_code=404,
            detail="Capture not found",
        )

    if capture.status != "completed" or not capture.archive_file_id:
        raise HTTPException(
            status_code=409,
            detail="Archive is not available yet",
        )

    return StreamingResponse(
        oa.stream_capture_archive(app, capture_id),
        media_type="application/wacz+zip",
        headers={
            "Content-Disposition": (
                f'attachment; filename="{capture_id}.wacz"'
            ),
        },
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
