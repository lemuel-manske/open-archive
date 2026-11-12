import { Size, Variant } from '@lemuel-manske/design-tokens';

import { useTranslation } from '@lemuel-manske/i18n/react';

import {
  AUTH_ACCOUNT,
  AUTH_ACCOUNT_FALLBACK,
  AUTH_DESCRIPTION,
  AUTH_LEGEND,
  AUTH_LOGIN_HINT,
  AUTH_LOGIN_URL,
  AUTH_PUBLIC,
  AUTH_REMOVE,
  AUTH_REMOVE_CONFIRM,
  AUTH_REMOVE_DESCRIPTION,
  AUTH_REMOVE_TITLE,
  AUTH_START,
  AUTH_STARTING,
} from '../../i18n/message-ids';

import { Alert, Button, Combobox, Field, Fieldset, Input } from '@lemuel-manske/components';

import { ConfirmationDialog } from '../confirmation-dialog/ConfirmationDialog';

import { LoginSessionNotice } from './LoginSessionNotice';

import type { CaptureAuthenticationProps } from './types';

import { useCaptureAuthentication } from './useCaptureAuthentication';

import styles from './CaptureAuthentication.module.css';

function CaptureAuthentication(props: CaptureAuthenticationProps) {
  const { t } = useTranslation();

  const authentication = useCaptureAuthentication(props);

  return (
    <Fieldset appearance="divided">
      <Fieldset.Legend size={Size.SMALL} tone="accent">
        {t(AUTH_LEGEND)}
      </Fieldset.Legend>

      <div className={styles.content}>
        <Field disabled={props.busy || authentication.active}>
          <Field.Label>{t(AUTH_ACCOUNT)}</Field.Label>

          <Field.Control>
            <Combobox
              ref={authentication.profileControlRef}
              value={props.profileId}
              onChange={(event) => props.onSelect(event.target.value)}
              name="profile"
            >
              <Combobox.Option value="">{t(AUTH_PUBLIC)}</Combobox.Option>

              {props.profiles.map((profile) => (
                <Combobox.Option key={profile._id} value={profile._id}>
                  {new URL(profile.url).hostname}
                </Combobox.Option>
              ))}
            </Combobox>
          </Field.Control>

          <Field.Description>{t(AUTH_DESCRIPTION)}</Field.Description>
        </Field>

        <div className={styles.actions}>
          <Button {...authentication.connectButton} />

          {props.profileId && (
            <Button
              variant={Variant.TERTIARY}
              disabled={props.busy || authentication.active}
              onClick={authentication.requestRemoval}
            >
              <Button.Label>{t(AUTH_REMOVE)}</Button.Label>
            </Button>
          )}
        </div>

        <div
          id={authentication.connectionId}
          hidden={!authentication.connecting || authentication.active}
        >
          <div className={styles.connection}>
            <Field disabled={props.busy || !authentication.connecting || authentication.active}>
              <Field.Label>{t(AUTH_LOGIN_URL)}</Field.Label>

              <Field.Control>
                <Input
                  type="url"
                  placeholder={props.url.trim() || 'https://site.com/login'}
                  value={authentication.loginUrl}
                  onChange={(event) => authentication.setLoginUrl(event.target.value)}
                />
              </Field.Control>

              <Field.Description>{t(AUTH_LOGIN_HINT)}</Field.Description>
            </Field>

            <Button
              variant={Variant.SECONDARY}
              disabled={!authentication.canStart}
              onClick={() => void authentication.start()}
            >
              <Button.Label>{props.busy ? t(AUTH_STARTING) : t(AUTH_START)}</Button.Label>
            </Button>
          </div>
        </div>

        {authentication.error && <Alert urgency="assertive">{authentication.error}</Alert>}

        <LoginSessionNotice session={props.session} busy={props.busy} onCancel={props.onCancel} />
      </div>

      <ConfirmationDialog
        open={authentication.profileToDelete !== null}
        title={t(AUTH_REMOVE_TITLE)}
        description={t(AUTH_REMOVE_DESCRIPTION, {
          account: authentication.profileToDelete?.name ?? t(AUTH_ACCOUNT_FALLBACK),
        })}
        confirmLabel={t(AUTH_REMOVE_CONFIRM)}
        onConfirm={authentication.remove}
        onClose={authentication.closeRemoval}
      />
    </Fieldset>
  );
}

export { CaptureAuthentication };
