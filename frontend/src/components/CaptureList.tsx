import { useState } from "react";

import { archiveUrl } from "../lib/api";
import { formatDate } from "../lib/dates";
import type { Capture, CaptureStatus } from "../types/capture";

const statusLabels: Record<CaptureStatus, string> = {
  pending: "Pendente",
  running: "Capturando",
  completed: "Concluída",
  failed: "Falhou",
};

interface Properties {
  captures: Capture[];
  loading: boolean;
  selectedId: string | null;
  deletingId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
}

interface CaptureGroup {
  url: string;
  versions: Capture[];
}

function groupCaptures(captures: Capture[]): CaptureGroup[] {
  const groups = new Map<string, Capture[]>();

  for (const capture of captures) {
    const versions = groups.get(capture.url) ?? [];
    versions.push(capture);
    groups.set(capture.url, versions);
  }

  return Array.from(groups, ([url, versions]) => ({
    url,
    versions: versions.sort((a, b) => b.created_at.localeCompare(a.created_at)),
  })).sort((a, b) => b.versions[0].created_at.localeCompare(a.versions[0].created_at));
}

export function CaptureList({
  captures,
  loading,
  selectedId,
  deletingId,
  onSelect,
  onDelete,
}: Properties) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const groups = groupCaptures(captures);

  function toggleGroup(url: string) {
    setExpanded((current) => current.includes(url)
      ? current.filter((item) => item !== url)
      : [...current, url]);
  }

  async function handleDelete(capture: Capture) {
    if (!window.confirm(
      `Excluir a captura de ${formatDate(capture.created_at)}? O WACZ será removido permanentemente.`
    )) {
      return;
    }

    await onDelete(capture._id);
  }

  function renderStatus(capture: Capture) {
    return (
      <span className={`status status-${capture.status}`}>
        <span className="status-dot" aria-hidden="true" />
        {statusLabels[capture.status]}
      </span>
    );
  }

  function renderActions(capture: Capture) {
    const completed = capture.status === "completed";

    return (
      <div className="capture-actions">
        {completed && (
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
        )}
        <button
          className="button button-danger"
          onClick={() => void handleDelete(capture)}
          disabled={capture.status === "running" || deletingId !== null}
          title={capture.status === "running" ? "Aguarde o término da captura" : "Excluir versão"}
        >
          {deletingId === capture._id ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    );
  }

  function renderVersion(capture: Capture) {
    return (
      <li className="capture-item" key={capture._id}>
        <div className="capture-info">
          {renderStatus(capture)}

          <time className="capture-date" dateTime={capture.created_at}>
            {formatDate(capture.created_at)}
          </time>

          <div className="capture-meta">
            Profundidade {capture.depth} · Limite {capture.limit} · Tentativa {capture.attempts}
          </div>

          {capture.status === "pending" && capture.next_attempt_at && (
            <div className="capture-meta">
              Nova tentativa: {formatDate(capture.next_attempt_at)}
            </div>
          )}

          {capture.profile_id && <div className="capture-meta">Captura autenticada</div>}

          {capture.error && <p className="capture-error">{capture.error}</p>}
        </div>

        {renderActions(capture)}
      </li>
    );
  }

  function renderGroup(group: CaptureGroup) {
    const open = expanded.includes(group.url);

    const newest = group.versions[0];

    return (
      <li className="capture-group" key={group.url}>
        <button
          className="capture-group-header"
          onClick={() => toggleGroup(group.url)}
          aria-expanded={open}
        >
          <span className="capture-group-title" title={group.url}>{group.url}</span>

          <span className="capture-group-summary">
            {group.versions.length} {group.versions.length === 1 ? "versão" : "versões"}
            Última captura: {formatDate(newest.created_at)}
          </span>

          <span className="capture-group-chevron" aria-hidden="true">{open ? "−" : "+"}</span>
        </button>

        {open && <ul className="capture-versions">{group.versions.map(renderVersion)}</ul>}
      </li>
    );
  }

  function renderBody() {
    if (loading && captures.length === 0) {
      return <p className="empty-state" role="status">Carregando histórico...</p>;
    }

    if (groups.length === 0) {
      return <p className="empty-state">Ainda não há capturas. Comece arquivando uma URL.</p>;
    }

    return <ul className="capture-groups">{groups.map(renderGroup)}</ul>;
  }

  return (
    <section className="panel" aria-labelledby="history-title">
      <div className="panel-heading panel-heading-row">
        <div>
          <span className="eyebrow">Biblioteca</span>

          <h2 id="history-title">Sites arquivados</h2>

          <p>Expanda um site para consultar e gerenciar suas versões.</p>
        </div>

        <span className="counter" aria-label={`${groups.length} sites carregados`}>
          {groups.length}
        </span>
      </div>

      {renderBody()}
    </section>
  );
}
