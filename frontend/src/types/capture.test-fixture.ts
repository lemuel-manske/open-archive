import type { BrowserProfile, Capture, LoginSession } from './capture';

const completedCapture: Capture = {
  _id: 'capture-1',
  url: 'https://example.org/article',
  depth: 1,
  limit: 20,
  status: 'completed',
  created_at: '2026-11-09T12:00:00Z',
  archive_file_id: 'archive-1',
  error: null,
  profile_id: null,
  attempts: 1,
  next_attempt_at: null,
};

const savedProfile: BrowserProfile = {
  _id: 'profile-1',
  name: 'Conta pessoal',
  url: 'https://example.org/login',
  created_at: '2026-11-08T12:00:00Z',
};

const runningLogin: LoginSession = {
  _id: 'login-1',
  url: 'https://example.org/login',
  status: 'running',
  profile_id: null,
  browser_url: 'http://localhost:9222/login-1',
  error: null,
};

export { completedCapture, savedProfile, runningLogin };
