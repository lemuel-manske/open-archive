import { useState, type SubmitEvent } from "react";

import type { CaptureRequest } from "../types/capture";

interface Props {
  busy: boolean;
  onSubmit: (request: CaptureRequest) => Promise<unknown>;
}

export function CaptureForm({ busy, onSubmit }: Props) {
  const [url, setUrl] = useState("");

  const [depth, setDepth] = useState(1);

  const [limit, setLimit] = useState(20);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await onSubmit({ url: url.trim(), depth, limit });

    if (result) setUrl("");
  }

  return (
    <section className="panel" aria-labelledby="capture-title">
      <div className="panel-heading">
        <span className="eyebrow">Nova captura</span>

        <h2 id="capture-title">Preserve uma página da web</h2>

        <p>Defina a URL inicial, a profundidade e o limite de páginas.</p>
      </div>

      <form className="capture-form" onSubmit={(event) => void handleSubmit(event)}>
        <div className="field field-grow">
          <label htmlFor="capture-url">URL inicial</label>
          <input
            id="capture-url"
            type="url"
            inputMode="url"
            placeholder="https://example.org/"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
            disabled={busy}
          />
        </div>

        <div className="form-options">
          <div className="field">
            <label htmlFor="capture-depth">Profundidade</label>

            <input
              id="capture-depth"
              type="number"
              min={0}
              max={5}
              value={depth}
              onChange={(event) => setDepth(Number(event.target.value))}
              disabled={busy}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="capture-limit">Máx. páginas</label>

            <input
              id="capture-limit"
              type="number"
              min={1}
              max={100}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              disabled={busy}
              required
            />
          </div>

          <button type="submit" className="button button-primary" disabled={busy}>
            {busy ? "Solicitando…" : "Arquivar URL"}
          </button>
        </div>
      </form>
    </section>
  );
}
