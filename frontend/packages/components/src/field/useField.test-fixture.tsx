import { Field } from "./Field";

import { FieldContext, useField } from "./useField";

import { Input } from "../input/Input";

function FieldHook() {
  const field = useField({ children: null, id: "name", required: true });

  return (
    <FieldContext value={field.context}>
      <Field.Label>Name</Field.Label>

      <Field.Control>
        <Input />
      </Field.Control>
    </FieldContext>
  );
}

export { FieldHook };
