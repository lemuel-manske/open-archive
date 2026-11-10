import { cx, useAccessibility } from "@openarchive/utils";

import { TextareaSize } from "./options";

import type { TextareaProps } from "./types";

import styles from "./Textarea.module.css";

function useTextarea({
  size = TextareaSize.MEDIUM,
  className,
  id,
  disabled = false,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
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
    className: cx(styles.textarea, className, {
      [styles.small]: size === TextareaSize.SMALL,
      [styles.medium]: size === TextareaSize.MEDIUM,
      [styles.large]: size === TextareaSize.LARGE,
    }),
  };
}

export { useTextarea };
