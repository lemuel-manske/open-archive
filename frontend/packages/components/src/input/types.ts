import type { ChangeEventHandler, FocusEventHandler, Ref } from "react";

import type { AccessibilityOptions } from "@openarchive/utils";

import type { InputSize } from "./options";

interface InputProps extends AccessibilityOptions {
  size?: InputSize;

  className?: string;

  name?: string;

  value?: string;

  defaultValue?: string;

  required?: boolean;

  "aria-invalid"?: boolean;

  autoComplete?: string;

  onChange?: ChangeEventHandler<HTMLInputElement>;

  onBlur?: FocusEventHandler<HTMLInputElement>;

  ref?: Ref<HTMLInputElement>;

  type?: "text" | "email" | "password" | "url" | "search" | "tel" | "number" | "date" | "time";

  placeholder?: string;

  readOnly?: boolean;

  min?: string | number;

  max?: string | number;

  step?: string | number;

  minLength?: number;

  maxLength?: number;

  pattern?: string;
}

export type { InputProps };
