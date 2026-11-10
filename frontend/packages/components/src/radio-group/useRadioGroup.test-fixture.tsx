import { RadioGroup } from "./RadioGroup";

import { RadioGroupContext, useRadioGroup } from "./useRadioGroup";

function RadioGroupHook() {
  const group = useRadioGroup({
    label: "Contact",
    children: null,
    name: "contact",
    value: "email",
  });

  return (
    <RadioGroupContext value={group}>
      <RadioGroup.Item value="email">Email</RadioGroup.Item>
    </RadioGroupContext>
  );
}

export { RadioGroupHook };
