interface ConfirmationDialogProps {
  open: boolean;

  title: string;

  description: string;

  confirmLabel: string;

  onConfirm: () => Promise<boolean>;

  onClose: () => void;
}

export type { ConfirmationDialogProps };
