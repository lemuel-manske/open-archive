from pathlib import Path
from zipfile import ZipFile

import app.application as oa
from app.infra.browsertrix import get_browsertrix_crawler
from app.infra.docker import get_docker_client
from app.infra.mongo import get_mongo_client, get_mongo_database
import pytest


@pytest.mark.asyncio
async def test_capture_end_to_end(tmp_path: Path):
    mongo = get_mongo_client()
    docker = get_docker_client()

    try:
        app = oa.init_app(
            db=get_mongo_database(mongo),
            crawler=get_browsertrix_crawler(docker),
        )

        # Use um site de teste acessível ao crawler.
        capture = await oa.request_capture(
            app,
            url="https://example.org/",
            depth=0,
            limit=1,
        )

        file_id = await oa.generate_wacz(
            app,
            capture._id,
        )

        saved = await oa.get_capture(
            app,
            capture._id,
        )

        assert saved is not None
        assert saved.status == "completed"
        assert saved.archive_file_id == file_id

        recovered = tmp_path / "recovered.wacz"

        with recovered.open("wb") as output:
            async for chunk in oa.stream_capture_archive(app, capture._id):
                output.write(chunk)

        assert recovered.stat().st_size > 0

        with ZipFile(recovered) as archive:
            assert archive.testzip() is None
            assert any(name.endswith(".warc.gz") for name in archive.namelist())

    finally:
        await mongo.close()
        docker.close()
