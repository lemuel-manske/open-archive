import { useState } from "react";
import type { SubmitEvent } from "react";

import type { CaptureRequest } from "../types/capture";

const NO_URL = "";

const DEFAULT_DEPTH = 1;
const DEFAULT_LIMIT = 20;

interface Properties {
  busy: boolean;

  onSubmit: (request: CaptureRequest) => Promise<unknown>;
}

export function CaptureForm({ busy, onSubmit }: Properties) {
  const [url, setUrl] = useState(NO_URL);

  const [depth, setDepth] = useState(DEFAULT_DEPTH);

  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await onSubmit({ url: url.trim(), depth, limit });

    if (result) setUrl(NO_URL);
  }

  const renderPanelHeading = () => {
    return (
      <div className="panel-heading">
        <span className="eyebrow">Nova captura</span>

        <h2 id="capture-title">Preserve uma página da web</h2>

        <p>Defina a URL inicial, a profundidade e o limite de páginas.</p>
      </div>
    );
  };

  const renderUrlField = () => {
    return (
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
    );
  };

  const renderDepthField = () => {
    return (
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
    );
  };

  const renderLimitField = () => {
    return (
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
    );
  };

  const renderSubmitButton = () => {
    return (
      <button type="submit" className="button button-primary" disabled={busy}>
        {busy ? "Solicitando..." : "Arquivar URL"}
      </button>
    );
  };

  const renderFormOptions = () => {
    return (
      <div className="form-options">
        {renderDepthField()}
        {renderLimitField()}
        {renderSubmitButton()}
      </div>
    );
  };

  const renderCaptureForm = () => {
    return (
      <form className="capture-form" onSubmit={(event) => void handleSubmit(event)}>
        {renderUrlField()}
        {renderFormOptions()}
      </form>
    );
  };

  return (
    <section className="panel" aria-labelledby="capture-title">
      {renderPanelHeading()}
      {renderCaptureForm()}
    </section>
  );
}
