import { cx, useAccessibility } from "@openarchive/utils";
import type { AccessibilityProperties } from "@openarchive/utils";

import { LabelSize } from "./options";
import type { LabelProps } from "./types";

import styles from "./Label.module.css";

type LabelElementProps = Omit<LabelProps, "size"> & AccessibilityProperties;

function useLabel({
  size = LabelSize.MEDIUM,
  className,
  id,
  htmlFor,
  children,
  ref,
}: LabelProps): LabelElementProps {
  const accessibility = useAccessibility({ id });

  const classes = cx(styles.label, className, {
    [styles.small]: size === LabelSize.SMALL,
    [styles.medium]: size === LabelSize.MEDIUM,
    [styles.large]: size === LabelSize.LARGE,
  });

  return { ...accessibility, htmlFor, children, ref, className: classes };
}

export { useLabel };
