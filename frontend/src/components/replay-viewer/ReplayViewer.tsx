import { useTranslation } from '@lemuel-manske/i18n/react';

import { REPLAY_CLOSE, REPLAY_TITLE } from '../../i18n/message-ids';

import { createElement } from 'react';

import { Button } from '@lemuel-manske/components';
import { Variant } from '@lemuel-manske/design-tokens';

import { ArchiveSection } from '../archive-section/ArchiveSection';

import type { ReplayViewerProps } from './types';

import { useReplayViewer } from './useReplayViewer';

import styles from './ReplayViewer.module.css';

function ReplayViewer(props: ReplayViewerProps) {
  const { t } = useTranslation();

  const viewer = useReplayViewer(props);

  return (
    <ArchiveSection
      id="replay"
      title={t(REPLAY_TITLE)}
      description={props.capture.url}
      sectionRef={viewer.sectionRef}
      actions={
        <Button variant={Variant.SECONDARY} onClick={props.onClose}>
          <Button.Label>{t(REPLAY_CLOSE)}</Button.Label>
        </Button>
      }
    >
      {createElement('replay-web-page', { ...viewer.replay, className: styles.frame })}
    </ArchiveSection>
  );
}

export { ReplayViewer };
