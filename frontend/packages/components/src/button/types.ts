import type { MouseEventHandler, ReactNode, Ref } from "react";

import type { AccessibilityOptions } from "@openarchive/utils";

import type { ButtonSize, ButtonVariant } from "./options";

interface ButtonProps extends AccessibilityOptions {
  children: ReactNode;

  size?: ButtonSize;

  variant?: ButtonVariant;

  type?: "button" | "submit" | "reset";

  className?: string;

  name?: string;

  value?: string;

  onClick?: MouseEventHandler<HTMLButtonElement>;

  ref?: Ref<HTMLButtonElement>;
}

export type { ButtonProps };
