import { Alert, Button, ButtonVariant, Dialog, Spinner, Text } from "@openarchive/components";

import type { ConfirmationDialogProps } from "./types";

import { useConfirmationDialog } from "./useConfirmationDialog";

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const confirmation = useConfirmationDialog(props);

  return (
    <Dialog
      title={props.title}
      open={props.open}
      onOpenChange={(open) => {
        if (!open) confirmation.close();
      }}
      closeLabel="Cancelar"
    >
      <Text>{props.description}</Text>

      {confirmation.error && <Alert urgency="assertive">{confirmation.error}</Alert>}

      {confirmation.pending && <Spinner label="Excluindo…" />}

      <Button
        variant={ButtonVariant.SECONDARY}
        disabled={confirmation.pending}
        onClick={() => void confirmation.confirm()}
      >
        <Button.Label>{props.confirmLabel}</Button.Label>
      </Button>
    </Dialog>
  );
}

export { ConfirmationDialog };
