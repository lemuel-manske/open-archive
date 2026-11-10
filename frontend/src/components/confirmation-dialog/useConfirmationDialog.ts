import { useState } from "react";

import type { ConfirmationDialogProps } from "./types";

function useConfirmationDialog({ onConfirm, onClose }: ConfirmationDialogProps) {
  const [pending, setPending] = useState(false);

  const [error, setError] = useState<string | null>(null);

  function close() {
    setError(null);

    onClose();
  }

  async function confirm() {
    if (pending) return;

    setPending(true);

    setError(null);

    try {
      const completed = await onConfirm();

      if (completed) close();
      else setError("Não foi possível concluir a exclusão. Tente novamente.");
    } catch {
      setError("Não foi possível concluir a exclusão. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return { pending, error, confirm, close };
}

export { useConfirmationDialog };
