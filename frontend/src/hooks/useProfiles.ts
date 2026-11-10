import { useCallback, useEffect, useRef, useState } from "react";

import {
  cancelLoginSession,
  createLoginSession,
  deleteProfile,
  getLoginSession,
  listProfiles,
} from "../lib/api";

import { isLoginActive } from "../lib/login";

import type { BrowserProfile, LoginSession } from "../types/capture";

import { useRequest } from "./useRequest";

const POLL_INTERVAL = 2000;

const SESSION_KEY = "openarchive.loginSession";

function useProfiles() {
  const [profiles, setProfiles] = useState<BrowserProfile[]>([]);

  const [profileId, setProfileId] = useState("");

  const [session, setSession] = useState<LoginSession | null>(null);

  const currentSession = useRef<LoginSession | null>(null);

  const profileRequest = useRequest();

  const sessionRequest = useRequest();

  const action = useRequest();

  const { execute: readProfiles, cancel: cancelProfiles } = profileRequest;

  const { execute: readSession, cancel: cancelSession } = sessionRequest;

  const updateSession = useCallback((next: LoginSession) => {
    currentSession.current = next;

    setSession(next);

    if (isLoginActive(next)) window.sessionStorage.setItem(SESSION_KEY, next._id);
    else window.sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const refreshProfiles = useCallback(async () => {
    const result = await readProfiles(listProfiles);

    if (result) setProfiles(result.data);

    return result;
  }, [readProfiles]);

  useEffect(() => {
    void refreshProfiles();
  }, [refreshProfiles]);

  useEffect(() => {
    const savedId = window.sessionStorage.getItem(SESSION_KEY);

    if (!savedId) return;

    void readSession(async (signal) => {
      try {
        return await getLoginSession(savedId, signal);
      } catch (cause) {
        if (signal.aborted) throw cause;

        if (window.sessionStorage.getItem(SESSION_KEY) === savedId) {
          window.sessionStorage.removeItem(SESSION_KEY);
        }

        return null;
      }
    }).then((result) => {
      if (result?.data) updateSession(result.data);
    });
  }, [readSession, updateSession]);

  const sessionId = session?._id;

  const loginActive = isLoginActive(session);

  const completedProfileId = session?.status === "completed" ? session.profile_id : null;

  useEffect(() => {
    if (!sessionId || !loginActive) return;

    const id = sessionId;

    async function poll() {
      const result = await readSession((signal) => getLoginSession(id, signal));

      if (result) updateSession(result.data);
    }

    void poll();

    const interval = window.setInterval(() => void poll(), POLL_INTERVAL);

    return () => {
      window.clearInterval(interval);

      cancelSession();
    };
  }, [sessionId, loginActive, readSession, cancelSession, updateSession]);

  useEffect(() => {
    if (!completedProfileId) return;

    let subscribed = true;

    cancelProfiles();

    void refreshProfiles().then((result) => {
      if (subscribed && result) setProfileId(completedProfileId);
    });

    return () => {
      subscribed = false;

      cancelProfiles();
    };
  }, [completedProfileId, refreshProfiles, cancelProfiles]);

  async function start(url: string) {
    if (isLoginActive(currentSession.current)) return false;

    profileRequest.clearError();

    sessionRequest.clearError();

    cancelSession();

    const result = await action.execute((signal) => createLoginSession(url.trim(), signal));

    if (!result) return false;

    updateSession(result.data);

    return true;
  }

  async function cancel() {
    const activeSession = currentSession.current;

    if (!activeSession || !isLoginActive(activeSession)) return;

    const result = await action.execute((signal) => cancelLoginSession(activeSession._id, signal));

    if (!result) return;

    cancelSession();

    const latest = currentSession.current;

    if (latest?._id === activeSession._id && isLoginActive(latest)) {
      updateSession({ ...latest, status: "cancelling" });
    }
  }

  async function remove(id: string) {
    profileRequest.clearError();

    sessionRequest.clearError();

    const result = await action.execute((signal) => deleteProfile(id, signal));

    if (!result) return false;

    cancelProfiles();

    setProfiles((current) => current.filter((profile) => profile._id !== id));

    setProfileId((current) => (current === id ? "" : current));

    return true;
  }

  return {
    profiles,
    profileId,
    setProfileId,
    session,
    busy: action.pending || profileRequest.pending || (!session && sessionRequest.pending),
    error: action.error ?? profileRequest.error ?? sessionRequest.error,
    start,
    cancel,
    remove,
  };
}

export { useProfiles };
