import { Fieldset } from "../fieldset/Fieldset";

import { RadioGroupContext, useRadioGroup, useRadioGroupItem } from "./useRadioGroup";

function ItemHook() {
  const item = useRadioGroupItem({ children: "Email", value: "email" });

  return (
    <label>
      <input {...item.input} />

      {item.children}
    </label>
  );
}

function RadioGroupItemHook({ disabled = false }: { disabled?: boolean }) {
  const group = useRadioGroup({
    label: "Contact",
    children: null,
    defaultValue: "email",
    disabled,
  });

  return (
    <RadioGroupContext value={group}>
      <Fieldset>
        <Fieldset.Legend>Contact</Fieldset.Legend>

        <ItemHook />
      </Fieldset>
    </RadioGroupContext>
  );
}

export { RadioGroupItemHook };
