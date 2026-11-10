import { useState } from "react";

import { useDialog } from "./useDialog";

function DialogHook() {
  const [open, setOpen] = useState(true);

  const dialog = useDialog({ open, onOpenChange: setOpen, title: "Example", children: null });

  return (
    <dialog {...dialog.props}>
      <h2 id={dialog.titleId}>Example</h2>

      <button onClick={dialog.close}>Close</button>
    </dialog>
  );
}

export { DialogHook };
