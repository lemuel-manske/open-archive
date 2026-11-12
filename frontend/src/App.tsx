import { useEffect } from 'react';

import { AppI18n } from './i18n/AppI18n';

import { defaultLocale } from './i18n/translator';

import type { AppLocale } from './i18n/translator';

import { Alert, Theme } from '@lemuel-manske/components';

import { archiveTheme } from '@lemuel-manske/design-tokens';

import { ArchiveLayout } from './components/archive-layout/ArchiveLayout';

import { CaptureForm } from './components/capture-form/CaptureForm';

import { CaptureList } from './components/capture-list/CaptureList';

import { ReplayViewer } from './components/replay-viewer/ReplayViewer';

import { useArchive } from './hooks/useArchive';

function Archive() {
  const archive = useArchive();

  const { collection, authentication } = archive;

  return (
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
  );
}

interface AppProps {
  locale?: AppLocale;
}

function App({ locale = defaultLocale }: AppProps) {
  useEffect(() => {
    document.documentElement.lang = locale;

    document.documentElement.dir = 'ltr';
  }, [locale]);

  return (
    <AppI18n locale={locale}>
      <Theme theme={archiveTheme}>
        <Archive />
      </Theme>
    </AppI18n>
  );
}

export default App;
