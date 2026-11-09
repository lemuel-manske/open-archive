export type CaptureStatus = "pending" | "running" | "completed" | "failed";

export interface Capture {
  _id: string;
  url: string;
  depth: number;
  limit: number;
  status: CaptureStatus;
  created_at: string;
  archive_file_id: string | null;
  error: string | null;
  profile_id: string | null;
  attempts: number;
  next_attempt_at: string | null;
}

export interface CaptureRequest {
  url: string;
  depth: number;
  limit: number;
  profile_id?: string | null;
}

export interface BrowserProfile {
  _id: string;
  name: string;
  url: string;
  created_at: string;
}

export type LoginStatus =
  | "pending"
  | "starting"
  | "running"
  | "cancelling"
  | "cancelled"
  | "completed"
  | "failed";

export interface LoginSession {
  _id: string;
  url: string;
  status: LoginStatus;
  profile_id: string | null;
  browser_url: string | null;
  error: string | null;
}

export interface CaptureAccepted {
  id: string;
  status: CaptureStatus;
}
