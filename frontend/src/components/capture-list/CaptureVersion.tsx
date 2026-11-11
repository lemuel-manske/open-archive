import { useLocale } from '../../i18n/useLocale';

import { useTranslation } from '@lemuel-manske/i18n/react';

import {
  CAPTURE_AUTHENTICATED,
  CAPTURE_COMPLETED,
  CAPTURE_FAILED,
  CAPTURE_DOWNLOAD,
  CAPTURE_RECORD_ID,
  CAPTURE_PENDING,
  CAPTURE_PLAY,
  CAPTURE_PLAYING,
  CAPTURE_RETRY,
  CAPTURE_RUNNING,
  COMMON_DELETE,
  COMMON_DELETING,
} from '../../i18n/message-ids';

import {
  Button,
  ButtonVariant,
  Link,
  Spinner,
  Text,
  TextSize,
  Timeline,
} from '@lemuel-manske/components';

import { captureArchive } from '../../lib/api';

import { formatCalendarDate, formatDate, formatTime } from '../../lib/dates';

import type { Capture, CaptureStatus } from '../../types/capture';

import styles from './CaptureList.module.css';

interface CaptureVersionProps {
  capture: Capture;

  selected: boolean;

  deletingId: string | null;

  onSelect: (id: string) => void;

  onRequestRemoval: (capture: Capture) => void;
}

function CaptureVersion({
  capture,
  selected,
  deletingId,
  onSelect,
  onRequestRemoval,
}: CaptureVersionProps) {
  const { t } = useTranslation();

  const locale = useLocale();

  const statusLabels: Record<CaptureStatus, string> = {
    pending: t(CAPTURE_PENDING),
    running: t(CAPTURE_RUNNING),
    completed: t(CAPTURE_COMPLETED),
    failed: t(CAPTURE_FAILED),
  };

  return (
    <Timeline.Item
      className={styles.timelineItem}
      label={
        <div className={styles.itemHeader}>
          <time className={styles.date} dateTime={capture.created_at}>
            {formatCalendarDate(capture.created_at, locale)}
          </time>

          {capture.status === 'running' ? (
            <span className={styles.captureStatus}>
              <Spinner label={statusLabels.running} />

              <span aria-hidden="true">{statusLabels.running}</span>
            </span>
          ) : (
            <Text as="span" size={TextSize.SMALL} className={styles.status}>
              {statusLabels[capture.status]}
            </Text>
          )}
        </div>
      }
      current={selected}
    >
      <div className={styles.version}>
        <Text className={styles.time}>
          <time dateTime={capture.created_at}>{formatTime(capture.created_at, locale)}</time>
        </Text>

        <div className={styles.actions}>
          {capture.status === 'completed' && (
            <Button variant={ButtonVariant.PRIMARY} onClick={() => onSelect(capture._id)}>
              <Button.Label>{selected ? t(CAPTURE_PLAYING) : t(CAPTURE_PLAY)}</Button.Label>
            </Button>
          )}

          {capture.status === 'completed' && (
            <Link href={captureArchive(capture._id)} download className={styles.download}>
              {t(CAPTURE_DOWNLOAD)}
            </Link>
          )}
          <Button
            className={styles.remove}
            variant={ButtonVariant.TERTIARY}
            disabled={capture.status === 'running' || deletingId !== null}
            onClick={() => onRequestRemoval(capture)}
          >
            <Button.Label>
              {deletingId === capture._id ? t(COMMON_DELETING) : t(COMMON_DELETE)}
            </Button.Label>
          </Button>
        </div>

        <div className={styles.metadata}>
          <Text size={TextSize.SMALL} className={styles.recordId}>
            {t(CAPTURE_RECORD_ID, { id: capture._id })}
          </Text>
          {capture.status === 'pending' && capture.next_attempt_at && (
            <Text size={TextSize.SMALL}>
              {t(CAPTURE_RETRY, { date: formatDate(capture.next_attempt_at, locale) })}
            </Text>
          )}

          {capture.profile_id && <Text size={TextSize.SMALL}>{t(CAPTURE_AUTHENTICATED)}</Text>}

          {capture.error && <Text className={styles.error}>{capture.error}</Text>}
        </div>
      </div>
    </Timeline.Item>
  );
}

export { CaptureVersion };
