import { useEffect, useRef, useState } from "react";

import type { Capture } from "../../types/capture";

import { groupCaptures } from "./groupCaptures";

import type { CaptureListProps } from "./types";

function useCaptureList({ captures, onDelete }: CaptureListProps) {
  const [query, setQuery] = useState("");

  const [captureToDelete, setCaptureToDelete] = useState<Capture | null>(null);

  const sectionRef = useRef<HTMLElement>(null);

  const returnFocus = useRef(false);

  const allGroups = groupCaptures(captures);

  const groups = allGroups.filter((group) =>
    group.url.toLowerCase().includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    if (!captureToDelete && returnFocus.current) {
      sectionRef.current?.focus();

      returnFocus.current = false;
    }
  }, [captureToDelete]);

  async function remove() {
    if (!captureToDelete) return false;

    const removed = await onDelete(captureToDelete._id);

    if (removed) returnFocus.current = true;

    return removed;
  }

  return {
    query,
    setQuery,
    groups,
    totalGroups: allGroups.length,
    captureToDelete,
    requestRemoval: setCaptureToDelete,
    closeRemoval: () => setCaptureToDelete(null),
    remove,
    sectionRef,
  };
}

export { useCaptureList };
