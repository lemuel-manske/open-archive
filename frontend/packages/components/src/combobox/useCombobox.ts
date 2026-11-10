import { cx, useAccessibility } from "@openarchive/utils";

import { ComboboxAppearance, ComboboxSize } from "./options";

import type { ComboboxProps } from "./types";

import styles from "./Combobox.module.css";

function useCombobox({
  size = ComboboxSize.MEDIUM,
  appearance = ComboboxAppearance.CUSTOM,
  className,
  id,
  disabled = false,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
  ...props
}: ComboboxProps) {
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
    className: cx(styles.combobox, className, {
      [styles.small]: size === ComboboxSize.SMALL,
      [styles.medium]: size === ComboboxSize.MEDIUM,
      [styles.large]: size === ComboboxSize.LARGE,
      [styles.custom]: appearance === ComboboxAppearance.CUSTOM,
    }),
  };
}

export { useCombobox };
