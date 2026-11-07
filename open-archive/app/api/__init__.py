from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request
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
