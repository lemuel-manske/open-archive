import type { ReactNode, Ref } from "react";

interface RadioGroupProps {
  children: ReactNode;

  label: string;

  name?: string;

  value?: string;

  defaultValue?: string;

  disabled?: boolean;

  required?: boolean;

  className?: string;

  "aria-describedby"?: string;

  onValueChange?: (value: string) => void;
}

interface RadioGroupItemProps {
  children: ReactNode;

  value: string;

  disabled?: boolean;

  className?: string;

  ref?: Ref<HTMLInputElement>;
}

export type { RadioGroupProps, RadioGroupItemProps };
