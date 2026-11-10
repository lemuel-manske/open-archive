import { useState } from "react";

import { useConfirmationDialog } from "./useConfirmationDialog";

function ConfirmationHook({ succeeds = true }: { succeeds?: boolean }) {
  const [open, setOpen] = useState(true);

  const confirmation = useConfirmationDialog({
    open,
    title: "Excluir",
    description: "Excluir captura",
    confirmLabel: "Excluir",
    onConfirm: async () => succeeds,
    onClose: () => setOpen(false),
  });

  return (
    <div>
      <p role="status">{open ? "Aberto" : "Fechado"}</p>

      <button onClick={() => void confirmation.confirm()}>Confirmar</button>

      {confirmation.error && <p role="alert">{confirmation.error}</p>}
    </div>
  );
}

export { ConfirmationHook };
