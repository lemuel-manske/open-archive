import type { LoginSession, LoginStatus } from "../types/capture";

const activeStatuses: LoginStatus[] = ["pending", "starting", "running", "cancelling"];

function isLoginActive(session: LoginSession | null): boolean {
  return session !== null && activeStatuses.includes(session.status);
}

export { isLoginActive };
