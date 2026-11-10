import { useState } from "react";

import { Field } from "./Field";

import { Input } from "../input/Input";

import { Button } from "../button/Button";

function ConditionalError() {
  const [invalid, setInvalid] = useState(true);

  return (
    <div>
      <Field>
        <Field.Label>Name</Field.Label>

        <Field.Control>
          <Input aria-describedby="external-hint" />
        </Field.Control>

        <Field.Description>Use your full name.</Field.Description>

        {invalid && <Field.Error>Name is required.</Field.Error>}
      </Field>

      <p id="external-hint">Visible to your team.</p>

      <Button onClick={() => setInvalid(false)}>Clear error</Button>
    </div>
  );
}

export { ConditionalError };
