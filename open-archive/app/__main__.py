from pathlib import Path
import asyncio

import app.application as application
import app.deps as deps


async def start():
    print("Running")

    _app = application.init_app(
        db=deps.mongo_db.get(),
        crawler=deps.browsertrix_crawler.get(),
    )

    capture = await application.request_capture(
        app=_app,
        url="https://www.google.com",
        depth=1,
        limit=1,
    )

    wacz_id = await application.generate_wacz(
        app=_app,
        capture_id=capture._id,
    )

    print(f"WACZ file generated at: {wacz_id}")

    capture_id = capture._id

    wacz_path = Path(f"./{capture_id}_retrieved.wacz")

    with wacz_path.open("wb") as output:
        async for chunk in application.stream_capture_archive(
            _app, capture_id
        ):
            output.write(chunk)


if __name__ == "__main__":
    asyncio.run(start())
