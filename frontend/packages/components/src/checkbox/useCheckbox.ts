import { cx, useAccessibility } from "@openarchive/utils";

import type { CheckboxProps } from "./types";

import styles from "./Checkbox.module.css";

function useCheckbox({
  children,
  className,
  id,
  disabled = false,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...props
}: CheckboxProps) {
  const accessibility = useAccessibility({
    id,
    disabled,
    "aria-label": label,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
  });

  return {
    children,
    className: cx(styles.checkbox, className),
    input: { ...props, ...accessibility, disabled, type: "checkbox" as const },
  };
}

export { useCheckbox };
