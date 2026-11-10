import type { ChangeEventHandler, ReactNode, Ref } from "react";

import type { AccessibilityOptions } from "@openarchive/utils";

interface CheckboxProps extends AccessibilityOptions {
  children: ReactNode;

  name?: string;

  value?: string;

  checked?: boolean;

  defaultChecked?: boolean;

  required?: boolean;

  "aria-invalid"?: boolean;

  className?: string;

  onChange?: ChangeEventHandler<HTMLInputElement>;

  ref?: Ref<HTMLInputElement>;
}

export type { CheckboxProps };
