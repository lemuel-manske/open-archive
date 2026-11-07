FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /opt/openarchive

COPY pyproject.toml .
COPY open-archive/ ./open-archive/

RUN pip install --no-cache-dir ".[app]"

WORKDIR /opt/openarchive/open-archive

EXPOSE 8000

CMD ["uvicorn", "app.api.main:api", "--host", "0.0.0.0", "--port", "8000"]
