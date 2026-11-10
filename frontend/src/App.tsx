import { Alert, Theme } from '@lemuel-manske/components';

import { archiveTheme } from '@lemuel-manske/design-tokens';

import { ArchiveLayout } from './components/archive-layout/ArchiveLayout';

import { CaptureForm } from './components/capture-form/CaptureForm';

import { CaptureList } from './components/capture-list/CaptureList';

import { ReplayViewer } from './components/replay-viewer/ReplayViewer';

import { useArchive } from './hooks/useArchive';

function App() {
  const archive = useArchive();

  const { collection, authentication } = archive;

  return (
    <Theme theme={archiveTheme}>
      <ArchiveLayout>
        {authentication.error && <Alert urgency="assertive">{authentication.error}</Alert>}

        {collection.error && <Alert urgency="assertive">{collection.error}</Alert>}

        <CaptureForm
          busy={collection.creating}
          profiles={authentication.profiles}
          profileId={authentication.profileId}
          session={authentication.session}
          profileBusy={authentication.busy}
          onSelectProfile={authentication.setProfileId}
          onStartLogin={authentication.start}
          onCancelLogin={authentication.cancel}
          onDeleteProfile={authentication.remove}
          onSubmit={collection.submit}
        />

        <CaptureList
          captures={collection.captures}
          loading={collection.loading}
          selectedId={archive.selectedId}
          deletingId={collection.deletingId}
          onSelect={archive.selectCapture}
          onDelete={archive.deleteCapture}
          onRefresh={collection.refresh}
        />

        {archive.selectedCapture?.status === 'completed' && (
          <ReplayViewer capture={archive.selectedCapture} onClose={archive.closeReplay} />
        )}
      </ArchiveLayout>
    </Theme>
  );
}

export default App;
