import { createElement } from "react";

import { archiveUrl } from "../lib/api";
import type { Capture } from "../types/capture";

interface Props {
  capture: Capture;
  onClose: () => void;
}

export function ReplayViewer({ capture, onClose }: Props) {
  return (
    <section className="panel replay-panel" aria-labelledby="replay-title">
      <div className="panel-heading panel-heading-row">
        <div>
          <span className="eyebrow">Visualização histórica</span>
          <h2 id="replay-title">Reprodução do arquivo</h2>
          <p className="replay-url">{capture.url}</p>
        </div>

        <button
          className="button button-secondary"
          onClick={onClose}
          aria-label="Fechar reprodução"
        >
          Fechar
        </button>
      </div>

      {createElement("replay-web-page", {
        key: capture._id,
        source: archiveUrl(capture._id),
        url: capture.url,
        replayBase: "/replay/",
        embed: "default",
        className: "replay-frame",
      })}
    </section>
  );
}
