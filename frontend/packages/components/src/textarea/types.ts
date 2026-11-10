import type { ChangeEventHandler, FocusEventHandler, Ref } from "react";

import type { AccessibilityOptions } from "@openarchive/utils";

import type { TextareaSize } from "./options";

interface TextareaProps extends AccessibilityOptions {
  size?: TextareaSize;

  className?: string;

  name?: string;

  value?: string;

  defaultValue?: string;

  required?: boolean;

  "aria-invalid"?: boolean;

  autoComplete?: string;

  onChange?: ChangeEventHandler<HTMLTextAreaElement>;

  onBlur?: FocusEventHandler<HTMLTextAreaElement>;

  ref?: Ref<HTMLTextAreaElement>;

  placeholder?: string;

  readOnly?: boolean;

  rows?: number;

  minLength?: number;

  maxLength?: number;
}

export type { TextareaProps };
