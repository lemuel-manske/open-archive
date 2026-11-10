import { Button } from "../button/Button";

import { Heading } from "../heading/Heading";

import type { DialogProps } from "./types";

import { useDialog } from "./useDialog";

import styles from "./Dialog.module.css";

function Dialog(props: DialogProps) {
  const dialog = useDialog(props);

  return (
    <dialog {...dialog.props}>
      <div className={styles.content}>
        <Heading id={dialog.titleId}>{props.title}</Heading>

        {props.children}

        <Button onClick={dialog.close}>
          <Button.Label>{props.closeLabel ?? "Close"}</Button.Label>
        </Button>
      </div>
    </dialog>
  );
}

export { Dialog };
