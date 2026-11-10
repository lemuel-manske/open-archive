import { cx } from "@openarchive/utils";

import { SpinnerSize } from "./options";

import type { SpinnerProps } from "./types";

import styles from "./Spinner.module.css";

function useSpinner({ label = "Loading", size = SpinnerSize.MEDIUM, className }: SpinnerProps) {
  return {
    label,
    className: cx(styles.spinner, className, {
      [styles.small]: size === SpinnerSize.SMALL,
      [styles.medium]: size === SpinnerSize.MEDIUM,
      [styles.large]: size === SpinnerSize.LARGE,
    }),
  };
}

export { useSpinner };
