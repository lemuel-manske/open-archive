import { useCallback, useEffect, useState } from "react";

import {
  cancelLoginSession,
  createLoginSession,
  deleteProfile,
  getLoginSession,
  listProfiles,
} from "../lib/api";
import type { BrowserProfile, LoginSession } from "../types/capture";

const POLL_INTERVAL = 2000;
const SESSION_KEY = "openarchive.loginSession";

export function useProfiles() {
  const [profiles, setProfiles] = useState<BrowserProfile[]>([]);
  const [profileId, setProfileId] = useState("");
  const [session, setSession] = useState<LoginSession | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    const data = await listProfiles(signal);
    if (!signal?.aborted) setProfiles(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal).catch((cause: unknown) => {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : String(cause));
      }
    });
    return () => controller.abort();
  }, [refresh]);

  useEffect(() => {
    const savedId = window.sessionStorage.getItem(SESSION_KEY);
    if (!savedId) return;

    const controller = new AbortController();
    void getLoginSession(savedId, controller.signal)
      .then((existing) => {
        if (!controller.signal.aborted) setSession(existing);
      })
      .catch(() => {
        if (!controller.signal.aborted) window.sessionStorage.removeItem(SESSION_KEY);
      });

    return () => controller.abort();
  }, []);

  const sessionId = session?._id;
  const sessionStatus = session?.status;

  useEffect(() => {
    if (!sessionId || !["pending", "starting", "running", "cancelling"].includes(sessionStatus ?? "")) {
      return;
    }

    const id = sessionId;
    const controller = new AbortController();
    let polling = false;

    async function poll() {
      if (polling || controller.signal.aborted) return;
      polling = true;

      try {
        const next = await getLoginSession(id, controller.signal);
        if (controller.signal.aborted) return;

        setSession(next);

        if (["completed", "failed", "cancelled"].includes(next.status)) {
          window.sessionStorage.removeItem(SESSION_KEY);
        }

        if (next.status === "completed" && next.profile_id) {
          setProfileId(next.profile_id);
          await refresh(controller.signal);
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : String(cause));
        }
      } finally {
        polling = false;
      }
    }

    void poll();
    const interval = window.setInterval(() => void poll(), POLL_INTERVAL);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [sessionId, sessionStatus, refresh]);

  async function start(url: string) {
    setBusy(true);
    setError(null);

    try {
      const created = await createLoginSession(url.trim());
      window.sessionStorage.setItem(SESSION_KEY, created._id);
      setSession(created);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!session) return;
    setBusy(true);
    setError(null);

    try {
      await cancelLoginSession(session._id);
      setSession((current) => current ? { ...current, status: "cancelling" } : null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    setError(null);

    try {
      await deleteProfile(id);
      setProfiles((current) => current.filter((profile) => profile._id !== id));
      if (profileId === id) setProfileId("");
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      return false;
    } finally {
      setBusy(false);
    }
  }

  return {
    profiles, profileId, setProfileId, session, busy, error, start, cancel, remove,
  };
}
