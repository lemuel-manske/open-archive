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

import { Alert, ButtonVariant, Form } from '@lemuel-manske/components';

import { ConfirmationDialog } from '../confirmation-dialog/ConfirmationDialog';

import { LoginSessionNotice } from './LoginSessionNotice';

import type { CaptureAuthenticationProps } from './types';

import { useCaptureAuthentication } from './useCaptureAuthentication';

import styles from './CaptureAuthentication.module.css';

function CaptureAuthentication(props: CaptureAuthenticationProps) {
  const { t } = useTranslation();

  const authentication = useCaptureAuthentication(props);

  return (
    <Form.Fieldset className={styles.fieldset}>
      <Form.Fieldset.Legend className={styles.legend}>{t(AUTH_LEGEND)}</Form.Fieldset.Legend>

      <div className={styles.content}>
        <Form.Field disabled={props.busy || authentication.active}>
          <Form.Field.Label>{t(AUTH_ACCOUNT)}</Form.Field.Label>

          <Form.Field.Control>
            <Form.Combobox
              ref={authentication.profileControlRef}
              value={props.profileId}
              onChange={(event) => props.onSelect(event.target.value)}
              name="profile"
            >
              <Form.Combobox.Option value="">{t(AUTH_PUBLIC)}</Form.Combobox.Option>

              {props.profiles.map((profile) => (
                <Form.Combobox.Option key={profile._id} value={profile._id}>
                  {new URL(profile.url).hostname}
                </Form.Combobox.Option>
              ))}
            </Form.Combobox>
          </Form.Field.Control>

          <Form.Field.Description>{t(AUTH_DESCRIPTION)}</Form.Field.Description>
        </Form.Field>

        <div className={styles.actions}>
          <button {...authentication.connectButton} />

          {props.profileId && (
            <Form.Button
              variant={ButtonVariant.TERTIARY}
              disabled={props.busy || authentication.active}
              onClick={authentication.requestRemoval}
            >
              <Form.Button.Label>{t(AUTH_REMOVE)}</Form.Button.Label>
            </Form.Button>
          )}
        </div>

        <div
          id={authentication.connectionId}
          hidden={!authentication.connecting || authentication.active}
        >
          <div className={styles.connection}>
            <Form.Field
              disabled={props.busy || !authentication.connecting || authentication.active}
            >
              <Form.Field.Label>{t(AUTH_LOGIN_URL)}</Form.Field.Label>

              <Form.Field.Control>
                <Form.Input
                  type="url"
                  placeholder={props.url.trim() || 'https://site.com/login'}
                  value={authentication.loginUrl}
                  onChange={(event) => authentication.setLoginUrl(event.target.value)}
                />
              </Form.Field.Control>

              <Form.Field.Description>{t(AUTH_LOGIN_HINT)}</Form.Field.Description>
            </Form.Field>

            <Form.Button
              variant={ButtonVariant.SECONDARY}
              disabled={!authentication.canStart}
              onClick={() => void authentication.start()}
            >
              <Form.Button.Label>{props.busy ? t(AUTH_STARTING) : t(AUTH_START)}</Form.Button.Label>
            </Form.Button>
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
    </Form.Fieldset>
  );
}

export { CaptureAuthentication };
