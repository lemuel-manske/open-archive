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
	$(PYTHON) -m uvicorn app.api.main:api --app-dir open-archive --reload --reload-dir open-archive/app

start-worker-dev:
	$(PYTHON) -m app.worker.main


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
	$(PYTHON) -m ruff check open-archive

format:
	$(PYTHON) -m ruff check --select I --fix open-archive
	$(PYTHON) -m ruff format open-archive

check: typecheck lint format-
