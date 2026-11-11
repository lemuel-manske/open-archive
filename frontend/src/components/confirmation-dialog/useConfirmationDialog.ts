import { useTranslation } from '@lemuel-manske/i18n/react';

import { COMMON_DELETE_ERROR } from '../../i18n/message-ids';

import { useState } from 'react';

import type { ConfirmationDialogProps } from './types';

function useConfirmationDialog({ onConfirm, onClose }: ConfirmationDialogProps) {
  const { t } = useTranslation();

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
      else setError(t(COMMON_DELETE_ERROR));
    } catch {
      setError(t(COMMON_DELETE_ERROR));
    } finally {
      setPending(false);
    }
  }

  return { pending, error, confirm, close };
}

export { useConfirmationDialog };
