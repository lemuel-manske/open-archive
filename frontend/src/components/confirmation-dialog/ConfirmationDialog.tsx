import { Variant } from '@lemuel-manske/design-tokens';

import { useTranslation } from '@lemuel-manske/i18n/react';

import { COMMON_CANCEL, COMMON_DELETING } from '../../i18n/message-ids';

import { Alert, Button, Dialog, Spinner, Text } from '@lemuel-manske/components';

import type { ConfirmationDialogProps } from './types';

import { useConfirmationDialog } from './useConfirmationDialog';

function ConfirmationDialog(props: ConfirmationDialogProps) {
  const { t } = useTranslation();

  const confirmation = useConfirmationDialog(props);

  return (
    <Dialog
      title={props.title}
      open={props.open}
      onOpenChange={(open) => {
        if (!open) confirmation.close();
      }}
      closeLabel={t(COMMON_CANCEL)}
    >
      <Text>{props.description}</Text>

      {confirmation.error && <Alert urgency="assertive">{confirmation.error}</Alert>}

      {confirmation.pending && <Spinner label={t(COMMON_DELETING)} />}

      <Button
        variant={Variant.SECONDARY}
        disabled={confirmation.pending}
        onClick={() => void confirmation.confirm()}
      >
        <Button.Label>{props.confirmLabel}</Button.Label>
      </Button>
    </Dialog>
  );
}

export { ConfirmationDialog };
