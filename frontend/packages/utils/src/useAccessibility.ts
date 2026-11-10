import { useId } from "react";

interface AccessibilityOptions {
  id?: string;

  disabled?: boolean;

  "aria-label"?: string;

  "aria-labelledby"?: string;

  "aria-describedby"?: string;
}

interface AccessibilityProperties {
  id: string;

  "aria-label"?: string;

  "aria-labelledby"?: string;

  "aria-describedby"?: string;

  "aria-disabled"?: true;

  tabIndex?: -1;
}

function useAccessibility({
  id,
  disabled,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  "aria-describedby": describedBy,
}: AccessibilityOptions = {}): AccessibilityProperties {
  const generatedId = useId();

  return {
    id: id ?? generatedId,
    "aria-label": label,
    "aria-labelledby": labelledBy,
    "aria-describedby": describedBy,
    "aria-disabled": disabled ? true : undefined,
    tabIndex: disabled ? -1 : undefined,
  };
}

export { useAccessibility, type AccessibilityOptions, type AccessibilityProperties };
