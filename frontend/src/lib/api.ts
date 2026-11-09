import type { BrowserProfile, Capture, CaptureAccepted, CaptureRequest, LoginSession } from "../types/capture";

const CAPTURES_ENDPOINT = "/captures";
const LOGIN_SESSIONS_ENDPOINT = "/login-sessions";

async function assertOk(response: Response): Promise<Response> {
  if (response.ok) return response;

  const body = await response.text();

  throw new Error(`HTTP ${response.status}: ${body || response.statusText}`);
}

export async function listCaptures(signal?: AbortSignal): Promise<Capture[]> {
  const response = await fetch(`${CAPTURES_ENDPOINT}?limit=100`, { signal });

  return (await assertOk(response)).json() as Promise<Capture[]>;
}

export async function createCapture(data: CaptureRequest): Promise<CaptureAccepted> {
  const response = await fetch(CAPTURES_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return (await assertOk(response)).json() as Promise<CaptureAccepted>;
}

export async function deleteCapture(id: string): Promise<void> {
  const response = await fetch(`${CAPTURES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  await assertOk(response);
}

export async function listProfiles(signal?: AbortSignal): Promise<BrowserProfile[]> {
  const response = await fetch("/profiles", { signal });

  return (await assertOk(response)).json() as Promise<BrowserProfile[]>;
}

export async function deleteProfile(id: string): Promise<void> {
  const response = await fetch(`/profiles/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  await assertOk(response);
}

export async function createLoginSession(url: string): Promise<LoginSession> {
  const response = await fetch(LOGIN_SESSIONS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  return (await assertOk(response)).json() as Promise<LoginSession>;
}

export async function getLoginSession(id: string, signal?: AbortSignal): Promise<LoginSession> {
  const response = await fetch(`${LOGIN_SESSIONS_ENDPOINT}/${encodeURIComponent(id)}`, { signal });

  return (await assertOk(response)).json() as Promise<LoginSession>;
}

export async function cancelLoginSession(id: string): Promise<void> {
  const response = await fetch(`${LOGIN_SESSIONS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  await assertOk(response);
}

export function archiveUrl(id: string): string {
  return `${CAPTURES_ENDPOINT}/${encodeURIComponent(id)}/archive`;
}
