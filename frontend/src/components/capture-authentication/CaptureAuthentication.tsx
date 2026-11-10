import { Alert, ButtonVariant, Form } from "@lemuel-manske/components";

import { ConfirmationDialog } from "../confirmation-dialog/ConfirmationDialog";

import { LoginSessionNotice } from "./LoginSessionNotice";

import type { CaptureAuthenticationProps } from "./types";

import { useCaptureAuthentication } from "./useCaptureAuthentication";

import styles from "./CaptureAuthentication.module.css";

function CaptureAuthentication(props: CaptureAuthenticationProps) {
  const authentication = useCaptureAuthentication(props);

  return (
    <Form.Fieldset>
      <Form.Fieldset.Legend>Sessão do site</Form.Fieldset.Legend>

      <div className={styles.content}>
        <Form.Field disabled={props.busy || authentication.active}>
          <Form.Field.Label>Conta para esta captura</Form.Field.Label>

          <Form.Field.Control>
            <Form.Combobox
              ref={authentication.profileControlRef}
              value={props.profileId}
              onChange={(event) => props.onSelect(event.target.value)}
              name="profile"
            >
              <Form.Combobox.Option value="">Página pública (sem login)</Form.Combobox.Option>

              {props.profiles.map((profile) => (
                <Form.Combobox.Option key={profile._id} value={profile._id}>
                  {new URL(profile.url).hostname}
                </Form.Combobox.Option>
              ))}
            </Form.Combobox>
          </Form.Field.Control>

          <Form.Field.Description>
            Para sites com login, conecte uma conta uma vez e reutilize a sessão nas capturas
            seguintes.
          </Form.Field.Description>
        </Form.Field>

        <div className={styles.actions}>
          <button {...authentication.connectButton} />

          {props.profileId && (
            <Form.Button
              variant={ButtonVariant.TERTIARY}
              disabled={props.busy || authentication.active}
              onClick={authentication.requestRemoval}
            >
              <Form.Button.Label>Remover conta</Form.Button.Label>
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
              <Form.Field.Label>URL de login do site</Form.Field.Label>

              <Form.Field.Control>
                <Form.Input
                  type="url"
                  placeholder={props.url.trim() || "https://site.com/login"}
                  value={authentication.loginUrl}
                  onChange={(event) => authentication.setLoginUrl(event.target.value)}
                />
              </Form.Field.Control>

              <Form.Field.Description>
                Deixe em branco para usar a URL inicial da captura.
              </Form.Field.Description>
            </Form.Field>

            <Form.Button
              variant={ButtonVariant.SECONDARY}
              disabled={!authentication.canStart}
              onClick={() => void authentication.start()}
            >
              <Form.Button.Label>{props.busy ? "Iniciando…" : "Iniciar login"}</Form.Button.Label>
            </Form.Button>
          </div>
        </div>

        {authentication.error && <Alert urgency="assertive">{authentication.error}</Alert>}

        <LoginSessionNotice session={props.session} busy={props.busy} onCancel={props.onCancel} />
      </div>

      <ConfirmationDialog
        open={authentication.profileToDelete !== null}
        title="Remover conta salva?"
        description={`A sessão de ${authentication.profileToDelete?.name ?? "esta conta"} será removida. As capturas existentes serão preservadas.`}
        confirmLabel="Excluir conta"
        onConfirm={authentication.remove}
        onClose={authentication.closeRemoval}
      />
    </Form.Fieldset>
  );
}

export { CaptureAuthentication };
