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

    wacz_path = await application.generate_wacz(
        app=_app,
        capture_id=capture._id,
    )

    print(f"WACZ file generated at: {wacz_path}")


if __name__ == "__main__":
    asyncio.run(start())
