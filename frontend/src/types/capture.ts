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
  attempts: number;
  next_attempt_at: string | null;
}

export interface CaptureRequest {
  url: string;
  depth: number;
  limit: number;
}

export interface CaptureAccepted {
  id: string;
  status: CaptureStatus;
}
