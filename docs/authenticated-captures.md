# Authenticated captures (backend)

The UI is unchanged in this branch. The backend creates browser profiles interactively
without asking users to upload cookies, `.tar.gz` files, or passwords to OpenArchive.

The browser session is created with Browsertrix, saved encrypted in GridFS, then
referenced by subsequent capture requests using `profile_id`.

## Setup

Generate an encryption key:

```bash
python -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())'
```

Add the result to the root `.env`:

```dotenv
CRAWLS_HOST_DIR=/absolute/path/to/open-archive/crawls
OPENARCHIVE_PROFILE_KEY=<generated-fernet-key>
```

Keep the key safe. Losing it makes stored profiles unreadable.

Start the stack:

```bash
docker compose up -d --build
```

## Create a login session

```bash
curl -X POST http://localhost:8000/login-sessions \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.org/login"}'
```

The response contains an `_id`. Poll:

```bash
curl http://localhost:8000/login-sessions/<session-id>
```

When `status` becomes `running`, the response includes
`"browser_url": "http://localhost:9223/"`. For other states it is `null`.
Open that URL on the Docker host.
Sign in using the embedded Browsertrix browser and click **Create Profile**.
The session status will eventually become `completed`, returning a `profile_id`.

Only one interactive session runs at a time. Sessions expire after 15 minutes.
Cancel an active session with:

```bash
curl -X DELETE http://localhost:8000/login-sessions/<session-id>
```

## Capture with the saved session

```bash
curl http://localhost:8000/profiles

curl -X POST http://localhost:8000/captures \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.org/private","depth":1,"limit":20,"profile_id":"<profile-id>"}'
```

Public captures continue working by omitting `profile_id`.

To delete a stored browser profile:

```bash
curl -X DELETE http://localhost:8000/profiles/<profile-id>
```

Deleting a profile is blocked if pending/running captures reference it.

## Security boundary

**Local development only.** Both the API and the interactive login browser bind to
`127.0.0.1` on the Docker host. The frontend remains unchanged; there is no user
authentication or per-archive authorization in this feature. Do not expose this
stack on a public server or untrusted network.

Browser profiles contain session tokens: these are encrypted in GridFS, but
decrypted temporarily into the shared crawl directory while used. Old profile
files may remain if the worker is forcibly killed, so protect the directory
and periodically clean orphaned files.

WACZ archives remain unencrypted. The MongoDB, Mongo Express, browser access
ports, and Docker socket must not be exposed to untrusted users.

Browsertrix login profiles may expire or be invalidated by the target website.
The interactive login endpoint is hosted on the machine running Docker, not
necessarily the same host where the browser accesses the frontend.

This release does not yet include full SSRF protections, network egress
restrictions or a private-archive authorization model.

## Validation

Run the MongoDB-backed integration tests:

```bash
docker compose up -d mongodb
MONGO_URI=mongodb://localhost:27017/ PYTHONPATH=open-archive \
pytest -q open-archive/tests/test_authenticated_captures.py
```

Then run one manual login end-to-end using Browsertrix and verify that the
capture completes and its archived WACZ opens in ReplayWeb.page.
