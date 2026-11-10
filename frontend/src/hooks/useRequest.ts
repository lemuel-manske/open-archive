import { useCallback, useEffect, useRef, useState } from "react";

interface RequestState {
  started: boolean;

  pending: boolean;

  error: string | null;
}

function useRequest() {
  const [state, setState] = useState<RequestState>({ started: false, pending: false, error: null });

  const active = useRef<AbortController | null>(null);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;

      active.current?.abort();

      active.current = null;
    };
  }, []);

  const cancel = useCallback(() => {
    active.current?.abort();

    active.current = null;

    if (mounted.current) {
      setState((current) => (current.pending ? { ...current, pending: false } : current));
    }
  }, []);

  const clearError = useCallback(() => {
    if (mounted.current) {
      setState((current) => (current.error === null ? current : { ...current, error: null }));
    }
  }, []);

  const execute = useCallback(async <Result>(request: (signal: AbortSignal) => Promise<Result>) => {
    if (!mounted.current || active.current) return null;

    const controller = new AbortController();

    active.current = controller;

    setState({ started: true, pending: true, error: null });

    try {
      const data = await request(controller.signal);

      return controller.signal.aborted ? null : { data };
    } catch (cause) {
      if (!controller.signal.aborted) {
        setState((current) => ({
          ...current,
          error: cause instanceof Error ? cause.message : String(cause),
        }));
      }

      return null;
    } finally {
      if (active.current === controller) {
        active.current = null;

        setState((current) => ({ ...current, pending: false }));
      }
    }
  }, []);

  return { ...state, execute, cancel, clearError };
}

export { useRequest };
