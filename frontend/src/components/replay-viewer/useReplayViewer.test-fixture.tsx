import { completedCapture } from "../../types/capture.test-fixture";

import { useReplayViewer } from "./useReplayViewer";

function ReplayViewerHook() {
  const viewer = useReplayViewer({ capture: completedCapture, onClose: () => {} });

  return (
    <section ref={viewer.sectionRef} tabIndex={-1} aria-label="Reprodução">
      <a href={viewer.replay.source}>Arquivo</a>
    </section>
  );
}

export { ReplayViewerHook };
