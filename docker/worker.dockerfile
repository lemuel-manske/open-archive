FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CRAWLS_PATH=/crawls

WORKDIR /opt/openarchive

COPY pyproject.toml .
COPY open-archive/ ./open-archive/

RUN pip install --no-cache-dir ".[app]"

WORKDIR /opt/openarchive/open-archive

CMD ["python", "-m", "app.worker.main"]
