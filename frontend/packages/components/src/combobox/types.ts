import type { ChangeEventHandler, FocusEventHandler, ReactNode, Ref } from "react";

import type { AccessibilityOptions } from "@openarchive/utils";

import type { ComboboxAppearance, ComboboxSize } from "./options";

interface ComboboxProps extends AccessibilityOptions {
  children: ReactNode;

  size?: ComboboxSize;

  appearance?: ComboboxAppearance;

  className?: string;

  name?: string;

  value?: string;

  defaultValue?: string;

  required?: boolean;

  "aria-invalid"?: boolean;

  autoComplete?: string;

  onChange?: ChangeEventHandler<HTMLSelectElement>;

  onBlur?: FocusEventHandler<HTMLSelectElement>;

  ref?: Ref<HTMLSelectElement>;
}

interface ComboboxOptionProps {
  children: string;

  value: string;

  disabled?: boolean;

  ref?: Ref<HTMLOptionElement>;
}

export type { ComboboxProps, ComboboxOptionProps };
