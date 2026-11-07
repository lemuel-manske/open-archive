# OpenArchive

## Objective

Develop a web-based platform for archiving, versioning, and retrieving websites while preserving their original structure and enabling historical navigation, even when the original content is no longer available.

## Tech Stack

| Component | Technology |
|---|---|
| Backend | Python + FastAPI |
| NoSQL Database | MongoDB |
| File Storage | MongoDB GridFS |
| Crawling Engine | Browsertrix Crawler |
| Archive Format | WACZ (WARC-based) |
| Archive Replay | ReplayWeb.page |
| Infrastructure | Docker Compose |
| Frontend | React |

## Core Features

1. **URL Archiving:** Capture web pages, including HTML, CSS, images, JavaScript, and other supported resources.
2. **Recursive Crawling:** Follow links up to a configurable depth (0, 1, 2, etc.), respecting domain, page count, and storage limits.
3. **Historical Replay:** Browse archived pages independently of the original website, identifying links that were not preserved.
4. **Versioning:** Maintain multiple snapshots of the same website captured at different times.
5. **Authenticated Archiving:** Support authenticated sessions through a temporary browser environment, allowing users to archive private pages they are authorized to access.
6. **Archive History:** Browse, search, and retrieve previous captures.

## MongoDB Responsibilities

- Store website, page, and capture metadata.
- Persist WACZ archives using GridFS.
- Maintain historical versions.
- Support indexed temporal queries.
- Demonstrate document-oriented modeling, compound indexes, and aggregation pipelines.

## Final Demonstration

1. Deploy a small website containing multiple interconnected pages.
2. Archive the website using OpenArchive with recursive crawling enabled.
3. Store the resulting WACZ archive in MongoDB GridFS.
4. Shut down the original website.
5. Retrieve the archived version and navigate through its internal links.
6. Demonstrate that the preserved pages remain accessible without relying on the original server.
