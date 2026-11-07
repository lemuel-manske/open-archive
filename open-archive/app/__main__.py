import app.app as app


if __name__ == "__main__":
    print("Running")

    crawler = app.browsertrix_crawler.get()

    wacz_path = crawler.generate_wacz(
        url="https://www.google.com",
        depth=1,
        limit=1,
    )

    print(f"WACZ file generated at: {wacz_path}")
