import { archiveUrl } from "../lib/api";
import { formatDate } from "../lib/dates";

import type { Capture, CaptureStatus } from "../types/capture";

const statusLabelsMap: Record<CaptureStatus, string> = {
  pending: "Pendente",
  running: "Capturando",
  completed: "Concluída",
  failed: "Falhou",
};

interface Properties {
  captures: Capture[];
  loading: boolean;
  selectedId: string | null;

  onSelect: (id: string) => void;
}

export function CaptureList({ captures, loading, selectedId, onSelect }: Properties) {
  const renderLoadingHistory = () => {
    return (
      <p className="empty-state" role="status">
        Carregando histórico...
      </p>
    );
  };

  const renderEmptyHistory = () => {
    return <p className="empty-state">Ainda não há capturas. Comece arquivando uma URL.</p>;
  };

  const renderCaptureStatus = (capture: Capture) => {
    return (
      <span className={`status status-${capture.status}`}>
        <span className="status-dot" aria-hidden="true" />

        {statusLabelsMap[capture.status]}
      </span>
    );
  };

  const renderCaptureInfo = (capture: Capture) => {
    return (
      <div className="capture-info">
        {renderCaptureStatus(capture)}

        <span className="capture-date">{formatDate(capture.created_at)}</span>

        <div className="capture-url" title={capture.url}>
          {capture.url}
        </div>

        <div className="capture-meta">
          Profundidade {capture.depth} · Limite {capture.limit}
        </div>

        {capture.error && <p className="capture-error">{capture.error}</p>}
      </div>
    );
  };

  const renderCaptureActions = (capture: Capture) => {
    if (capture.status !== "completed") {
      return (
        <span className="capture-wait">{capture.status === "failed" ? "—" : "Aguardando"}</span>
      );
    }

    const isSelected = selectedId === capture._id;

    return (
      <>
        <button
          className={`button button-secondary${isSelected ? " is-selected" : ""}`}
          aria-pressed={isSelected}
          onClick={() => onSelect(capture._id)}
        >
          Reproduzir
        </button>

        <a className="button button-ghost" href={archiveUrl(capture._id)} download>
          WACZ
        </a>
      </>
    );
  };

  const renderCaptureItem = (capture: Capture) => {
    return (
      <li className="capture-item" key={capture._id}>
        {renderCaptureInfo(capture)}

        <div className="capture-actions">{renderCaptureActions(capture)}</div>
      </li>
    );
  };

  const renderCaptureList = () => {
    return <ul className="capture-list">{captures.map(renderCaptureItem)}</ul>;
  };

  const renderPanelBody = () => {
    if (loading && captures.length === 0) {
      return renderLoadingHistory();
    }

    if (captures.length === 0) {
      return renderEmptyHistory();
    }

    return renderCaptureList();
  };

  return (
    <section className="panel" aria-labelledby="history-title">
      <div className="panel-heading panel-heading-row">
        <div>
          <span className="eyebrow">Biblioteca</span>

          <h2 id="history-title">Histórico de capturas</h2>
        </div>

        <span className="counter" aria-label={`${captures.length} capturas carregadas`}>
          {captures.length}
        </span>
      </div>

      {renderPanelBody()}
    </section>
  );
}
