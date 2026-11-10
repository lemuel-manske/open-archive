import { cx, useAccessibility } from "@openarchive/utils";

import type { FormProps } from "./types";

import styles from "./Form.module.css";

function useForm({
  className,
  id,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  ...props
}: FormProps) {
  const accessibility = useAccessibility({
    id,
    "aria-label": label,
    "aria-labelledby": labelledBy,
  });

  return { ...props, ...accessibility, className: cx(styles.form, className) };
}

export { useForm };
