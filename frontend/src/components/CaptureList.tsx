import { archiveUrl } from "../lib/api";
import { formatDate } from "../lib/dates";
import type { Capture, CaptureStatus } from "../types/capture";

interface Props {
  captures: Capture[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusLabels: Record<CaptureStatus, string> = {
  pending: "Pendente",
  running: "Capturando",
  completed: "Concluída",
  failed: "Falhou",
};

export function CaptureList({ captures, loading, selectedId, onSelect }: Props) {
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

      {loading && captures.length === 0 ? (
        <p className="empty-state" role="status">
          Carregando histórico…
        </p>
      ) : captures.length === 0 ? (
        <p className="empty-state">Ainda não há capturas. Comece arquivando uma URL.</p>
      ) : (
        <ul className="capture-list">
          {captures.map((capture) => (
            <li className="capture-item" key={capture._id}>
              <div className="capture-info">
                <span className={`status status-${capture.status}`}>
                  <span className="status-dot" aria-hidden="true" />
                  {statusLabels[capture.status]}
                </span>

                <span className="capture-date">{formatDate(capture.created_at)}</span>

                <div className="capture-url" title={capture.url}>
                  {capture.url}
                </div>

                <div className="capture-meta">
                  Profundidade {capture.depth} · Limite {capture.limit}
                </div>

                {capture.error && <p className="capture-error">{capture.error}</p>}
              </div>
              <div className="capture-actions">
                {capture.status === "completed" ? (
                  <>
                    <button
                      className={`button button-secondary${selectedId === capture._id ? " is-selected" : ""}`}
                      onClick={() => onSelect(capture._id)}
                      aria-pressed={selectedId === capture._id}
                    >
                      Reproduzir
                    </button>

                    <a className="button button-ghost" href={archiveUrl(capture._id)} download>
                      WACZ
                    </a>
                  </>
                ) : (
                  <span className="capture-wait">
                    {capture.status === "failed" ? "—" : "Aguardando"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
