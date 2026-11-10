import { useEffect, useRef } from "react";

import { captureArchive } from "../../lib/api";

import type { ReplayViewerProps } from "./types";

function useReplayViewer({ capture }: ReplayViewerProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    sectionRef.current?.focus();
  }, [capture._id]);

  return {
    sectionRef,
    replay: {
      key: capture._id,
      source: captureArchive(capture._id),
      url: capture.url,
      replayBase: "/replay/",
      embed: "default",
    },
  };
}

export { useReplayViewer };
