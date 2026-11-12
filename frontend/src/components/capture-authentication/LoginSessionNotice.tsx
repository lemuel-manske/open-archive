import { Variant } from '@lemuel-manske/design-tokens';

import { useTranslation } from '@lemuel-manske/i18n/react';

import {
  AUTH_CANCEL,
  AUTH_CANCELLING,
  AUTH_FAILED,
  AUTH_INSTRUCTIONS,
  AUTH_OPEN,
  AUTH_PREPARING,
  AUTH_SAVED,
} from '../../i18n/message-ids';

import { Alert, Button, Link, Spinner, Text } from '@lemuel-manske/components';

import type { LoginSession } from '../../types/capture';

import styles from './CaptureAuthentication.module.css';

interface LoginSessionNoticeProps {
  session: LoginSession | null;

  busy: boolean;

  onCancel: () => Promise<void>;
}

function LoginSessionNotice({ session, busy, onCancel }: LoginSessionNoticeProps) {
  const { t } = useTranslation();

  if (!session) return null;

  if (session.status === 'completed') {
    return <Alert>{t(AUTH_SAVED)}</Alert>;
  }

  if (session.status === 'failed' || session.status === 'cancelled') {
    return <Alert>{session.error || t(AUTH_FAILED)}</Alert>;
  }

  return (
    <div className={styles.session}>
      {session.status === 'running' ? (
        <Text>{t(AUTH_INSTRUCTIONS)}</Text>
      ) : (
        <Spinner label={session.status === 'cancelling' ? t(AUTH_CANCELLING) : t(AUTH_PREPARING)} />
      )}

      <div className={styles.actions}>
        {session.browser_url && (
          <Link href={session.browser_url} target="_blank">
            {t(AUTH_OPEN)}
          </Link>
        )}

        {session.status !== 'cancelling' && (
          <Button variant={Variant.SECONDARY} disabled={busy} onClick={() => void onCancel()}>
            <Button.Label>{t(AUTH_CANCEL)}</Button.Label>
          </Button>
        )}
      </div>
    </div>
  );
}

export { LoginSessionNotice };
