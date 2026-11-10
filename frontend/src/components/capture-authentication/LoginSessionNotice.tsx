import { Alert, Button, ButtonVariant, Link, Spinner, Text } from "@lemuel-manske/components";

import type { LoginSession } from "../../types/capture";

import styles from "./CaptureAuthentication.module.css";

interface LoginSessionNoticeProps {
  session: LoginSession | null;

  busy: boolean;

  onCancel: () => Promise<void>;
}

function LoginSessionNotice({ session, busy, onCancel }: LoginSessionNoticeProps) {
  if (!session) return null;

  if (session.status === "completed") {
    return <Alert>Sessão salva. A conta está selecionada para a próxima captura.</Alert>;
  }

  if (session.status === "failed" || session.status === "cancelled") {
    return (
      <Alert>{session.error || "A conexão não foi concluída. Você pode tentar novamente."}</Alert>
    );
  }

  return (
    <div className={styles.session}>
      {session.status === "running" ? (
        <Text>
          Entre na sua conta na janela do Browsertrix e clique em <strong>Create Profile</strong> ao
          terminar.
        </Text>
      ) : (
        <Spinner
          label={
            session.status === "cancelling"
              ? "Cancelando conexão…"
              : "Preparando o navegador para conectar sua conta…"
          }
        />
      )}

      <div className={styles.actions}>
        {session.browser_url && (
          <Link href={session.browser_url} target="_blank">
            Abrir navegador de login
          </Link>
        )}

        {session.status !== "cancelling" && (
          <Button variant={ButtonVariant.SECONDARY} disabled={busy} onClick={() => void onCancel()}>
            <Button.Label>Cancelar conexão</Button.Label>
          </Button>
        )}
      </div>
    </div>
  );
}

export { LoginSessionNotice };
