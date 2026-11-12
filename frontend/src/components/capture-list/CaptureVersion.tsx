import {
  Button,
  Heading,
  Link,
  LinkAppearance,
  Spinner,
  Text,
  Timeline,
} from '@lemuel-manske/components';
import { Size, Tone, Variant, Weight } from '@lemuel-manske/design-tokens';
import { useTranslation } from '@lemuel-manske/i18n/react';

import { useLocale } from '../../i18n/useLocale';
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
  const statusTone =
    capture.status === 'completed'
      ? Tone.SUCCESS
      : capture.status === 'failed'
        ? Tone.DANGER
        : 'secondary';

  return (
    <Timeline.Item
      label={
        <div className={styles.itemHeader}>
          <Heading level={4} size={Size.SMALL} weight={Weight.MEDIUM}>
            <time dateTime={capture.created_at}>
              {formatCalendarDate(capture.created_at, locale)}
            </time>
          </Heading>
          {capture.status === 'running' ? (
            <Spinner label={statusLabels.running} size={Size.SMALL} labelHidden={false} />
          ) : (
            <Text as="span" size={Size.SMALL} tone={statusTone}>
              {statusLabels[capture.status]}
            </Text>
          )}
        </div>
      }
      current={selected}
    >
      <div className={styles.version}>
        <Text size={Size.SMALL} tone="secondary">
          <time dateTime={capture.created_at}>{formatTime(capture.created_at, locale)}</time>
        </Text>
        <div className={styles.actions}>
          {capture.status === 'completed' && (
            <>
              <Button onClick={() => onSelect(capture._id)}>
                <Button.Label>{selected ? t(CAPTURE_PLAYING) : t(CAPTURE_PLAY)}</Button.Label>
              </Button>
              <Link
                href={captureArchive(capture._id)}
                download
                appearance={LinkAppearance.ACTION}
                size={Size.SMALL}
              >
                {t(CAPTURE_DOWNLOAD)}
              </Link>
            </>
          )}
          <Button
            variant={Variant.TERTIARY}
            tone={Tone.DANGER}
            disabled={capture.status === 'running' || deletingId !== null}
            onClick={() => onRequestRemoval(capture)}
          >
            <Button.Label>
              {deletingId === capture._id ? t(COMMON_DELETING) : t(COMMON_DELETE)}
            </Button.Label>
          </Button>
        </div>
        <div className={styles.metadata}>
          <Text size={Size.SMALL} tone="secondary">
            {t(CAPTURE_RECORD_ID, { id: capture._id })}
          </Text>
          {capture.status === 'pending' && capture.next_attempt_at && (
            <Text size={Size.SMALL}>
              {t(CAPTURE_RETRY, { date: formatDate(capture.next_attempt_at, locale) })}
            </Text>
          )}
          {capture.profile_id && <Text size={Size.SMALL}>{t(CAPTURE_AUTHENTICATED)}</Text>}
          {capture.error && <Text tone={Tone.DANGER}>{capture.error}</Text>}
        </div>
      </div>
    </Timeline.Item>
  );
}

export { CaptureVersion };
