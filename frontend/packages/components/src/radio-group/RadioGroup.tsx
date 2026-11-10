import { Fieldset, Legend } from "../fieldset/Fieldset";

import type { RadioGroupProps, RadioGroupItemProps } from "./types";

import { RadioGroupContext, useRadioGroup, useRadioGroupItem } from "./useRadioGroup";

import styles from "./RadioGroup.module.css";

function RadioGroupItem(props: RadioGroupItemProps) {
  const item = useRadioGroupItem(props);

  return (
    <label className={item.className}>
      <input {...item.input} />

      <span>{item.children}</span>
    </label>
  );
}

function RadioGroup(props: RadioGroupProps) {
  const group = useRadioGroup(props);

  return (
    <RadioGroupContext value={group}>
      <Fieldset
        disabled={props.disabled}
        className={props.className}
        aria-describedby={props["aria-describedby"]}
      >
        <Legend>{props.label}</Legend>

        <div className={styles.items}>{props.children}</div>
      </Fieldset>
    </RadioGroupContext>
  );
}

RadioGroup.Item = RadioGroupItem;

export { RadioGroup, RadioGroupItem };
