import { cx, useAccessibility } from "@openarchive/utils";

import { InputSize } from "./options";

import type { InputProps } from "./types";

import styles from "./Input.module.css";

function useInput({
  size = InputSize.MEDIUM,
  className,
  id,
  disabled = false,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...props
}: InputProps) {
  const accessibility = useAccessibility({
    id,
    disabled,
    "aria-label": label,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
  });

  return {
    ...props,
    ...accessibility,
    disabled,
    className: cx(styles.input, className, {
      [styles.small]: size === InputSize.SMALL,
      [styles.medium]: size === InputSize.MEDIUM,
      [styles.large]: size === InputSize.LARGE,
    }),
  };
}

export { useInput };
