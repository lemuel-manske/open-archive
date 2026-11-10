import { useEffect, useRef, useState } from "react";

import { useCaptures } from "./useCaptures";

import { useProfiles } from "./useProfiles";

function useArchive() {
  const collection = useCaptures();

  const authentication = useProfiles();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const replayTrigger = useRef<HTMLElement | null>(null);

  const selectedCapture = collection.captures.find((capture) => capture._id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedCapture && replayTrigger.current) {
      if (replayTrigger.current.isConnected) replayTrigger.current.focus();

      replayTrigger.current = null;
    }
  }, [selectedCapture]);

  function selectCapture(id: string) {
    replayTrigger.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    setSelectedId(id);
  }

  async function deleteCapture(id: string) {
    const removed = await collection.remove(id);

    if (removed) setSelectedId((current) => (current === id ? null : current));

    return removed;
  }

  return {
    collection,
    authentication,
    selectedId,
    selectedCapture,
    selectCapture,
    closeReplay: () => setSelectedId(null),
    deleteCapture,
  };
}

export { useArchive };
