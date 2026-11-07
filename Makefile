VENV ?= .venv

EXTRAS ?= dev, app

PYTHON ?= $(if $(wildcard $(VENV)/bin/python),$(VENV)/bin/python,python3)


ifneq (,$(wildcard .env))
  include .env
  export
endif


.PHONY: init
.PHONY: typecheck lint format format-check check


install:
	$(PYTHON) -m pip install -e '.[$(EXTRAS)]'


start:
	$(PYTHON) -m open-archive.app


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
