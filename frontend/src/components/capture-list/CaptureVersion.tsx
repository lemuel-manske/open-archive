import { Button, ButtonVariant, Link, Text, TextSize } from "@openarchive/components";

import { captureArchive } from "../../lib/api";

import { formatDate } from "../../lib/dates";

import type { Capture, CaptureStatus } from "../../types/capture";

import styles from "./CaptureList.module.css";

const statusLabels: Record<CaptureStatus, string> = {
  pending: "Pendente",
  running: "Capturando",
  completed: "Concluída",
  failed: "Falhou",
};

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
  return (
    <li className={styles.version}>
      <div className={styles.metadata}>
        <Text as="span">{statusLabels[capture.status]}</Text>

        <time dateTime={capture.created_at}>{formatDate(capture.created_at)}</time>

        <Text size={TextSize.SMALL}>
          Profundidade {capture.depth} · Limite {capture.limit} · Tentativa {capture.attempts}
        </Text>

        {capture.status === "pending" && capture.next_attempt_at && (
          <Text size={TextSize.SMALL}>Nova tentativa: {formatDate(capture.next_attempt_at)}</Text>
        )}

        {capture.profile_id && <Text size={TextSize.SMALL}>Captura autenticada</Text>}

        {capture.error && <Text className={styles.error}>{capture.error}</Text>}
      </div>

      <div className={styles.actions}>
        {capture.status === "completed" && (
          <>
            <Button
              variant={selected ? ButtonVariant.PRIMARY : ButtonVariant.SECONDARY}
              onClick={() => onSelect(capture._id)}
            >
              <Button.Label>{selected ? "Em reprodução" : "Reproduzir"}</Button.Label>
            </Button>

            <Link href={captureArchive(capture._id)} download>
              Baixar WACZ
            </Link>
          </>
        )}

        <Button
          variant={ButtonVariant.TERTIARY}
          disabled={capture.status === "running" || deletingId !== null}
          onClick={() => onRequestRemoval(capture)}
        >
          <Button.Label>{deletingId === capture._id ? "Excluindo…" : "Excluir"}</Button.Label>
        </Button>
      </div>
    </li>
  );
}

export { CaptureVersion };
