import { useLayoutEffect, useRef } from "react";

import type { SyntheticEvent } from "react";

import { cx, useAccessibility } from "@openarchive/utils";

import type { DialogProps } from "./types";

import styles from "./Dialog.module.css";

function useDialog({ open, onOpenChange, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  const { id } = useAccessibility();

  useLayoutEffect(() => {
    const dialog = ref.current;

    if (!dialog) return;

    if (!open) {
      if (dialog.open) dialog.close();

      return;
    }

    const previousFocus = dialog.ownerDocument.activeElement;

    if (!dialog.open) dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [open]);

  return {
    titleId: id,
    close: () => onOpenChange(false),
    props: {
      ref,
      "aria-labelledby": id,
      className: cx(styles.dialog, className),
      onCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
        event.preventDefault();

        onOpenChange(false);
      },
      onClose: () => {
        if (open && ref.current && !ref.current.open) {
          onOpenChange(false);
        }
      },
    },
  };
}

export { useDialog };
