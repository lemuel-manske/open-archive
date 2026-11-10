import { Form, Spinner, Text } from "@openarchive/components";

import { ArchiveSection } from "../archive-section/ArchiveSection";

import { CaptureAuthentication } from "../capture-authentication/CaptureAuthentication";

import type { CaptureFormProps } from "./types";

import { useCaptureForm } from "./useCaptureForm";

import styles from "./CaptureForm.module.css";

function CaptureForm(props: CaptureFormProps) {
  const form = useCaptureForm(props);

  return (
    <ArchiveSection
      id="new-capture"
      title="Preserve uma página da web"
      description="Defina a URL inicial, a profundidade e o limite de páginas."
    >
      <Form aria-label="Nova captura" onSubmit={(event) => void form.submit(event)}>
        <Form.Field disabled={props.busy} required>
          <Form.Field.Label>URL inicial</Form.Field.Label>

          <Form.Field.Control>
            <Form.Input
              type="url"
              name="url"
              placeholder="https://example.org/"
              value={form.url}
              onChange={(event) => form.setUrl(event.target.value)}
            />
          </Form.Field.Control>
        </Form.Field>

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
          <Form.Field disabled={props.busy} required>
            <Form.Field.Label>Profundidade</Form.Field.Label>

            <Form.Field.Control>
              <Form.Input
                type="number"
                name="depth"
                min={0}
                max={5}
                value={form.depth}
                onChange={(event) => form.setDepth(event.target.value)}
              />
            </Form.Field.Control>
          </Form.Field>

          <Form.Field disabled={props.busy} required>
            <Form.Field.Label>Máx. páginas</Form.Field.Label>

            <Form.Field.Control>
              <Form.Input
                type="number"
                name="limit"
                min={1}
                max={100}
                value={form.limit}
                onChange={(event) => form.setLimit(event.target.value)}
              />
            </Form.Field.Control>
          </Form.Field>

          <Form.Button type="submit" disabled={form.submitDisabled}>
            <Form.Button.Label>{props.busy ? "Solicitando…" : "Arquivar URL"}</Form.Button.Label>
          </Form.Button>
        </div>

        {props.busy && <Spinner label="Solicitando captura…" />}

        {form.loginActive && <Text>Conclua ou cancele a conexão da conta antes de arquivar.</Text>}
      </Form>
    </ArchiveSection>
  );
}

export { CaptureForm };
