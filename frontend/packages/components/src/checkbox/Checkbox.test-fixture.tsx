import { useState } from "react";

import { Checkbox } from "./Checkbox";

function ControlledCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)}>
      Subscribe
    </Checkbox>
  );
}

export { ControlledCheckbox };
