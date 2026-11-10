import { cx } from "@openarchive/utils";

import type { AlertProps } from "./types";

import styles from "./Alert.module.css";

function useAlert({ urgency = "polite", className, ...props }: AlertProps) {
  return {
    ...props,
    role: urgency === "assertive" ? "alert" : "status",
    "aria-atomic": true as const,
    className: cx(styles.alert, className),
  };
}

export { useAlert };
