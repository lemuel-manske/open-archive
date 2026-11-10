import { cx, useAccessibility } from "@openarchive/utils";
import type { AccessibilityProperties } from "@openarchive/utils";

import { ButtonSize, ButtonVariant } from "./options";
import type { ButtonProps } from "./types";

import styles from "./Button.module.css";

type ButtonElementProps = Omit<ButtonProps, "size" | "variant"> & AccessibilityProperties;

function useButton({
  size = ButtonSize.MEDIUM,
  variant = ButtonVariant.PRIMARY,
  type = "button",
  className,
  children,
  onClick,
  ref,
  name,
  value,
  ...accessibilityOptions
}: ButtonProps): ButtonElementProps {
  const accessibility = useAccessibility(accessibilityOptions);

  const classes = cx(styles.button, className, {
    [styles.small]: size === ButtonSize.SMALL,
    [styles.medium]: size === ButtonSize.MEDIUM,
    [styles.large]: size === ButtonSize.LARGE,

    [styles.primary]: variant === ButtonVariant.PRIMARY,
    [styles.secondary]: variant === ButtonVariant.SECONDARY,
    [styles.tertiary]: variant === ButtonVariant.TERTIARY,
  });

  return {
    ...accessibility,
    children,
    type,
    onClick,
    ref,
    name,
    value,
    disabled: accessibilityOptions.disabled ?? false,
    className: classes,
  };
}

export { useButton };
