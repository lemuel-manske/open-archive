import { useState } from "react";

import { CaptureForm } from "./components/CaptureForm";
import { CaptureList } from "./components/CaptureList";
import { ReplayViewer } from "./components/ReplayViewer";
import { useCaptures } from "./hooks/useCaptures";
import { useProfiles } from "./hooks/useProfiles";

export default function App() {
  const { captures, loading, creating, deletingId, error, refresh, submit, remove } = useCaptures();

  const {
    profiles,
    profileId,
    setProfileId,
    session,
    busy: profileBusy,
    error: profileError,
    start: startLogin,
    cancel: cancelLogin,
    remove: removeProfile,
  } = useProfiles();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = captures.find((capture) => capture._id === selectedId);

  async function handleDelete(id: string): Promise<boolean> {
    const deleted = await remove(id);

    if (deleted && selectedId === id) setSelectedId(null);

    return deleted;
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-content">
          <a className="brand" href="/" aria-label="OpenArchive - início">
            <span className="brand-mark" aria-hidden="true">
              O
            </span>

            <span>
              Open<span className="brand-accent">Archive</span>
            </span>
          </a>

          <span className="header-label">Web preservation lab</span>
        </div>
      </header>

      <main className="main-content">
        <div className="hero">
          <div>
            <span className="eyebrow">Arquivo digital</span>

            <h1>
              A web muda. <span>Suas capturas permanecem.</span>
            </h1>

            <p>Preserve páginas da web, acompanhe o processamento e explore versões arquivadas.</p>
          </div>
        </div>

        {profileError && (
          <div className="alert" role="alert">
            {profileError}
          </div>
        )}

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}

        <CaptureForm
          busy={creating}
          profiles={profiles}
          profileId={profileId}
          session={session}
          profileBusy={profileBusy}
          onSelectProfile={setProfileId}
          onStartLogin={startLogin}
          onCancelLogin={cancelLogin}
          onDeleteProfile={removeProfile}
          onSubmit={submit}
        />

        <div className="section-topline">
          <span>CAPTURAS RECENTES</span>

          <button className="text-action" onClick={() => void refresh()}>
            Atualizar histórico
          </button>
        </div>

        <CaptureList
          captures={captures}
          loading={loading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          deletingId={deletingId}
          onDelete={handleDelete}
        />

        {selected?.status === "completed" && (
          <ReplayViewer capture={selected} onClose={() => setSelectedId(null)} />
        )}
      </main>

      <footer className="site-footer">
        <span>OpenArchive</span>
      </footer>
    </div>
  );
}
