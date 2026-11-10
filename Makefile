VENV ?= .venv

EXTRAS ?= dev, app

PYTHON ?= $(if $(wildcard $(VENV)/bin/python),$(VENV)/bin/python,python3)


ifneq (,$(wildcard .env))
  include .env
  export
endif


.PHONY: install
.PHONY: start-fastapi-dev start-worker-dev
.PHONY: config start stop restart
.PHONY: test
.PHONY: typecheck lint format format-check check


install:
	$(PYTHON) -m pip install -e '.[$(EXTRAS)]'


start-fastapi-dev:
	$(PYTHON) -m uvicorn backend.api.main:api --reload --reload-dir backend

start-worker-dev:
	$(PYTHON) -m backend.worker.main


config:
	docker-compose config

start:
	docker-compose up -d

stop:
	docker-compose down

restart:
	docker-compose down
	docker-compose up -d --build


test:
	$(PYTHON) -m pytest -v --tb=short --disable-warnings --maxfail=1


typecheck:
	$(PYTHON) -m pyright

lint:
	$(PYTHON) -m ruff check backend

format:
	$(PYTHON) -m ruff check --select I --fix backend
	$(PYTHON) -m ruff format backend

check: typecheck lint format-
