FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CRAWLS_PATH=/crawls

WORKDIR /opt/openarchive

COPY pyproject.toml .
COPY backend/ ./backend/

RUN pip install --no-cache-dir ".[app]"

CMD ["python", "-m", "backend.worker.main"]
