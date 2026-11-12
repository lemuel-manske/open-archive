import { useTranslation } from '@lemuel-manske/i18n/react';

import {
  FORM_DEPTH,
  FORM_DESCRIPTION,
  FORM_LIMIT,
  FORM_KICKER,
  FORM_LOADING,
  FORM_LOGIN_ACTIVE,
  FORM_NAME,
  FORM_SUBMIT,
  FORM_SUBMITTING,
  FORM_TITLE,
  FORM_URL,
} from '../../i18n/message-ids';

import { Button, Field, Form, Input, Spinner, Text } from '@lemuel-manske/components';

import { ArchiveSection } from '../archive-section/ArchiveSection';

import { CaptureAuthentication } from '../capture-authentication/CaptureAuthentication';

import type { CaptureFormProps } from './types';

import { useCaptureForm } from './useCaptureForm';

import styles from './CaptureForm.module.css';

function CaptureForm(props: CaptureFormProps) {
  const { t } = useTranslation();

  const form = useCaptureForm(props);

  return (
    <ArchiveSection
      id="new-capture"
      kicker={t(FORM_KICKER)}
      title={t(FORM_TITLE)}
      description={t(FORM_DESCRIPTION)}
    >
      <div className={styles.sheet}>
        <Form aria-label={t(FORM_NAME)} onSubmit={(event) => void form.submit(event)}>
          <Field disabled={props.busy} required>
            <Field.Label>{t(FORM_URL)}</Field.Label>

            <Field.Control>
              <Input
                type="url"
                name="url"
                placeholder="https://example.org/"
                value={form.url}
                onChange={(event) => form.setUrl(event.target.value)}
              />
            </Field.Control>
          </Field>

          <CaptureAuthentication
            url={form.url}
            profiles={props.profiles}
            profileId={props.profileId}
            session={props.session}
            busy={props.busy || props.profileBusy}
            onSelect={props.onSelectProfile}
            onStart={props.onStartLogin}
            onCancel={props.onCancelLogin}
            onDelete={props.onDeleteProfile}
          />

          <div className={styles.options}>
            <Field disabled={props.busy} required>
              <Field.Label>{t(FORM_DEPTH)}</Field.Label>

              <Field.Control>
                <Input
                  type="number"
                  name="depth"
                  min={0}
                  max={5}
                  value={form.depth}
                  onChange={(event) => form.setDepth(event.target.value)}
                />
              </Field.Control>
            </Field>

            <Field disabled={props.busy} required>
              <Field.Label>{t(FORM_LIMIT)}</Field.Label>

              <Field.Control>
                <Input
                  type="number"
                  name="limit"
                  min={1}
                  max={100}
                  value={form.limit}
                  onChange={(event) => form.setLimit(event.target.value)}
                />
              </Field.Control>
            </Field>

            <div className={styles.submit}>
              <Button type="submit" disabled={form.submitDisabled}>
                <Button.Label>{props.busy ? t(FORM_SUBMITTING) : t(FORM_SUBMIT)}</Button.Label>
              </Button>
            </div>
          </div>

          {props.busy && <Spinner label={t(FORM_LOADING)} />}

          {form.loginActive && <Text>{t(FORM_LOGIN_ACTIVE)}</Text>}
        </Form>
      </div>
    </ArchiveSection>
  );
}

export { CaptureForm };
