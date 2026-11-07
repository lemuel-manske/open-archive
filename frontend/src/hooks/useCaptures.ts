import { useCallback, useEffect, useState } from "react";

import { createCapture, deleteCapture, listCaptures } from "../lib/api";
import type { Capture, CaptureRequest } from "../types/capture";

export function useCaptures() {
  const [captures, setCaptures] = useState<Capture[]>([]);

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = useCallback(async (signal?: AbortSignal) => {
    try {
      const data = await listCaptures(signal);

      if (!signal?.aborted) {
        setCaptures(data);
        setError(null);
      }
    } catch (cause) {
      if (!signal?.aborted) setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void refresh(controller.signal);

    const interval = window.setInterval(() => void refresh(controller.signal), 3000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [refresh]);

  const submit = useCallback(
    async (data: CaptureRequest) => {
      setCreating(true);

      setError(null);

      try {
        const result = await createCapture(data);

        await refresh();

        return result;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : String(cause));

        return null;
      } finally {
        setCreating(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(async (id: string) => {
    setDeletingId(id);

    setError(null);

    try {
      await deleteCapture(id);

      setCaptures((current) => current.filter((capture) => capture._id !== id));

      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));

      return false;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return { captures, loading, creating, deletingId, error, refresh, submit, remove };
}
