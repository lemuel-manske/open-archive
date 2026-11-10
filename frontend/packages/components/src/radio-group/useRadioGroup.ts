import { createContext, useContext } from "react";

import { cx, useAccessibility } from "@openarchive/utils";

import type { RadioGroupProps, RadioGroupItemProps } from "./types";

import styles from "./RadioGroup.module.css";

interface RadioContextValue {
  name: string;

  value?: string;

  defaultValue?: string;

  disabled?: boolean;

  required?: boolean;

  select: (value: string) => void;
}

const RadioGroupContext = createContext<RadioContextValue | null>(null);

function useRadioGroup({
  name,
  value,
  defaultValue,
  disabled,
  required,
  onValueChange,
}: RadioGroupProps) {
  const { id } = useAccessibility();

  return {
    name: name ?? id,
    value,
    defaultValue,
    disabled,
    required,
    select: (next: string) => {
      onValueChange?.(next);
    },
  };
}

function useRadioGroupItem({ children, value, disabled, className, ref }: RadioGroupItemProps) {
  const group = useContext(RadioGroupContext);

  const accessibility = useAccessibility({ disabled: disabled || group?.disabled });

  if (!group) {
    throw new Error("RadioGroup.Item must be rendered inside RadioGroup.");
  }

  return {
    children,
    className: cx(styles.item, className),
    input: {
      ...accessibility,
      ref,
      type: "radio" as const,
      name: group.name,
      value,
      checked: group.value === undefined ? undefined : group.value === value,
      defaultChecked: group.value === undefined ? group.defaultValue === value : undefined,
      disabled: disabled || group.disabled,
      required: group.required,
      onChange: () => group.select(value),
    },
  };
}

export { RadioGroupContext, useRadioGroup, useRadioGroupItem };
