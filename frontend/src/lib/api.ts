import type {
  BrowserProfile,
  Capture,
  CaptureAccepted,
  CaptureRequest,
  LoginSession,
} from '../types/capture';

const DELETE_METHOD = 'DELETE';
const POST_METHOD = 'POST';

const HEADERS = { 'Content-Type': 'application/json' };

function captures(limit?: number): string {
  return '/captures' + (limit ? `?limit=${limit}` : '');
}

function capture(id: string): string {
  return captures() + '/' + encodeURIComponent(id);
}

function captureArchive(id: string): string {
  return capture(id) + '/archive';
}

function profiles(): string {
  return '/profiles';
}

function profile(id: string): string {
  return profiles() + '/' + encodeURIComponent(id);
}

function loginSessions(): string {
  return '/login-sessions';
}

function loginSession(id: string): string {
  return loginSessions() + '/' + encodeURIComponent(id);
}

async function assertOk(response: Response): Promise<Response> {
  if (response.ok) return response;

  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}

async function listCaptures(signal?: AbortSignal): Promise<Capture[]> {
  const response = await fetch(captures(100), { signal });

  return (await assertOk(response)).json() as Promise<Capture[]>;
}

async function createCapture(data: CaptureRequest, signal?: AbortSignal): Promise<CaptureAccepted> {
  const response = await fetch(captures(), {
    method: POST_METHOD,
    headers: HEADERS,
    body: JSON.stringify(data),
    signal,
  });

  return (await assertOk(response)).json() as Promise<CaptureAccepted>;
}

async function deleteCapture(id: string, signal?: AbortSignal): Promise<void> {
  const response = await fetch(capture(id), {
    method: DELETE_METHOD,
    signal,
  });

  await assertOk(response);
}

async function listProfiles(signal?: AbortSignal): Promise<BrowserProfile[]> {
  const response = await fetch(profiles(), { signal });

  return (await assertOk(response)).json() as Promise<BrowserProfile[]>;
}

async function deleteProfile(id: string, signal?: AbortSignal): Promise<void> {
  const response = await fetch(profile(id), {
    method: DELETE_METHOD,
    signal,
  });

  await assertOk(response);
}

async function createLoginSession(url: string, signal?: AbortSignal): Promise<LoginSession> {
  const response = await fetch(loginSessions(), {
    method: POST_METHOD,
    headers: HEADERS,
    body: JSON.stringify({ url }),
    signal,
  });

  return (await assertOk(response)).json() as Promise<LoginSession>;
}

async function getLoginSession(id: string, signal?: AbortSignal): Promise<LoginSession> {
  const response = await fetch(loginSession(id), { signal });

  return (await assertOk(response)).json() as Promise<LoginSession>;
}

async function cancelLoginSession(id: string, signal?: AbortSignal): Promise<void> {
  const response = await fetch(loginSession(id), {
    method: DELETE_METHOD,
    signal,
  });

  await assertOk(response);
}

export { captures, capture, captureArchive, profiles, profile, loginSessions, loginSession };

export {
  listCaptures,
  createCapture,
  deleteCapture,
  listProfiles,
  deleteProfile,
  createLoginSession,
  getLoginSession,
  cancelLoginSession,
};
