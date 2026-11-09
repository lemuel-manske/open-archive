import { useState } from "react";

import type { BrowserProfile, LoginSession } from "../types/capture";

interface Properties {
  url: string;
  profiles: BrowserProfile[];
  profileId: string;
  session: LoginSession | null;
  busy: boolean;
  onSelect: (id: string) => void;
  onStart: (url: string) => Promise<boolean>;
  onCancel: () => Promise<void>;
  onDelete: (id: string) => Promise<boolean>;
}

export function CaptureAuthentication({
  url,
  profiles,
  profileId,
  session,
  busy,
  onSelect,
  onStart,
  onCancel,
  onDelete,
}: Properties) {
  const [connecting, setConnecting] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");

  const active = session && ["pending", "starting", "running", "cancelling"].includes(session.status);

  async function handleStart() {
    const created = await onStart(loginUrl.trim() || url.trim());
    if (created) {
      setLoginUrl("");
      setConnecting(false);
    }
  }

  async function handleDelete() {
    if (!profileId || !window.confirm("Excluir esta sessão salva?")) return;
    await onDelete(profileId);
  }

  function renderSession() {
    if (!session) return null;

    if (session.status === "completed") {
      return (
        <div className="login-session" role="status">
          <p>Sessão salva. A conta já está selecionada para a próxima captura.</p>
        </div>
      );
    }

    if (session.status === "failed" || session.status === "cancelled") {
      return (
        <div className="login-session" role="status">
          <p>{session.error || "A conexão não foi concluída. Você pode tentar novamente."}</p>
        </div>
      );
    }

    return (
      <div className="login-session" role="status">
        {session.status === "running" ? (
          <p>Entre na sua conta na janela do Browsertrix e clique em <strong>Create Profile</strong> ao terminar.</p>
        ) : session.status === "cancelling" ? (
          <p>Cancelando conexão...</p>
        ) : (
          <p>Preparando o navegador para conectar sua conta...</p>
        )}
        <div className="login-session-actions">
          {session.browser_url && (
            <a
              className="button button-primary"
              href={session.browser_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir navegador de login
            </a>
          )}
          {session.status !== "cancelling" && (
            <button className="button button-secondary" type="button" onClick={() => void onCancel()} disabled={busy}>
              Cancelar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <div className="profile-heading">
        <label htmlFor="capture-profile">Sessão do site (opcional)</label>
        <button
          className="text-action"
          type="button"
          onClick={() => setConnecting((current) => !current)}
          disabled={Boolean(active)}
        >
          Conectar nova conta
        </button>
      </div>

      <div className="profile-fields">
        <select
          id="capture-profile"
          value={profileId}
          onChange={(event) => onSelect(event.target.value)}
          disabled={busy || Boolean(active)}
        >
          <option value="">Página pública (sem login)</option>
          {profiles.map((profile) => (
            <option key={profile._id} value={profile._id}>
              {profile.name} · {new URL(profile.url).hostname}
            </option>
          ))}
        </select>
        {profileId && (
          <button className="button button-danger" type="button" onClick={() => void handleDelete()} disabled={busy || Boolean(active)}>
            Remover conta
          </button>
        )}
      </div>

      {connecting && !active && (
        <div className="profile-fields">
          <input
            aria-label="URL de login do site"
            type="url"
            placeholder={url.trim() || "https://site.com/login"}
            value={loginUrl}
            onChange={(event) => setLoginUrl(event.target.value)}
            disabled={busy}
          />
          <button
            className="button button-secondary"
            type="button"
            onClick={() => void handleStart()}
            disabled={busy || !(loginUrl.trim() || url.trim())}
          >
            {busy ? "Iniciando..." : "Iniciar login"}
          </button>
        </div>
      )}

      {renderSession()}

      <p className="profile-help">
        Para sites com login, conecte uma conta uma vez e reutilize a sessão nas capturas seguintes.
      </p>
    </div>
  );
}
