import { useState } from "react";

import { Dialog } from "./Dialog";

import { Button } from "../button/Button";

import { Input } from "../input/Input";

function DialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Edit name</Button>

      <Dialog title="Edit name" open={open} onOpenChange={setOpen}>
        <Input aria-label="Name" />
      </Dialog>
    </div>
  );
}

function ConditionalDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Edit name</Button>

      {open && (
        <Dialog title="Edit name" open onOpenChange={setOpen}>
          <Input aria-label="Name" />
        </Dialog>
      )}
    </div>
  );
}

export { DialogExample, ConditionalDialogExample };
