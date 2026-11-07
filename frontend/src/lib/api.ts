import type { Capture, CaptureAccepted, CaptureRequest } from "../types/capture";

const CAPTURES_ENDPOINT = "/captures";

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

export function archiveUrl(id: string): string {
  return `${CAPTURES_ENDPOINT}/${encodeURIComponent(id)}`;
}
