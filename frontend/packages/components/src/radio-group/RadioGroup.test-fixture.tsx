import { useState } from "react";

import { RadioGroup } from "./RadioGroup";

function ControlledRadioGroup() {
  const [value, setValue] = useState("email");

  return (
    <RadioGroup label="Contact method" value={value} onValueChange={setValue}>
      <RadioGroup.Item value="email">Email</RadioGroup.Item>

      <RadioGroup.Item value="phone">Phone</RadioGroup.Item>
    </RadioGroup>
  );
}

export { ControlledRadioGroup };
