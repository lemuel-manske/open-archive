import { useCallback, useEffect, useState } from 'react';

import { createCapture, deleteCapture, listCaptures } from '../lib/api';

import type { Capture, CaptureRequest } from '../types/capture';

import { useRequest } from './useRequest';

const POLL_INTERVAL = 3000;

function useCaptures() {
  const [captures, setCaptures] = useState<Capture[]>([]);

  const [deletionTarget, setDeletionTarget] = useState<string | null>(null);

  const reading = useRequest();

  const creation = useRequest();

  const deletion = useRequest();

  const { execute: read, cancel: cancelRead } = reading;

  const refresh = useCallback(async () => {
    const result = await read(listCaptures);

    if (result) setCaptures(result.data);
  }, [read]);

  useEffect(() => {
    void refresh();

    const interval = window.setInterval(() => void refresh(), POLL_INTERVAL);

    return () => {
      window.clearInterval(interval);

      cancelRead();
    };
  }, [refresh, cancelRead]);

  async function submit(request: CaptureRequest) {
    reading.clearError();

    deletion.clearError();

    const result = await creation.execute(async (signal) => {
      const accepted = await createCapture(request, signal);

      if (!signal.aborted) {
        cancelRead();

        await refresh();
      }

      return accepted;
    });

    return result?.data ?? null;
  }

  async function remove(id: string) {
    reading.clearError();

    creation.clearError();

    const result = await deletion.execute((signal) => {
      setDeletionTarget(id);

      return deleteCapture(id, signal);
    });

    if (!result) return false;

    cancelRead();

    setCaptures((current) => current.filter((capture) => capture._id !== id));

    return true;
  }

  return {
    captures,
    loading: !reading.started || reading.pending,
    creating: creation.pending,
    deletingId: deletion.pending ? deletionTarget : null,
    error: deletion.error ?? creation.error ?? reading.error,
    refresh,
    submit,
    remove,
  };
}

export { useCaptures };
