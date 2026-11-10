type CaptureStatus = "pending" | "running" | "completed" | "failed";

interface Capture {
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

interface CaptureRequest {
  url: string;
  depth: number;
  limit: number;
  profile_id?: string | null;
}

interface BrowserProfile {
  _id: string;
  name: string;
  url: string;
  created_at: string;
}

type LoginStatus =
  | "pending"
  | "starting"
  | "running"
  | "cancelling"
  | "cancelled"
  | "completed"
  | "failed";

interface LoginSession {
  _id: string;
  url: string;
  status: LoginStatus;
  profile_id: string | null;
  browser_url: string | null;
  error: string | null;
}

interface CaptureAccepted {
  id: string;
  status: CaptureStatus;
}

export type {
  CaptureStatus,
  Capture,
  CaptureRequest,
  BrowserProfile,
  LoginStatus,
  LoginSession,
  CaptureAccepted,
};
