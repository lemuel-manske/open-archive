import { useState } from "react";

import { Form } from "./Form";

function FormExample() {
  const [result, setResult] = useState("");

  return (
    <Form
      aria-label="Capture"
      onSubmit={(event) => {
        event.preventDefault();

        setResult(String(new FormData(event.currentTarget).get("url")));
      }}
    >
      <Form.Label htmlFor="url">Website URL</Form.Label>

      <Form.Input id="url" name="url" type="url" required />

      <Form.Button type="submit">
        <Form.Button.Label>Save</Form.Button.Label>
      </Form.Button>

      <output aria-label="Submitted URL">{result}</output>
    </Form>
  );
}

function ControlledInput() {
  const [value, setValue] = useState("");

  return (
    <Form.Input
      aria-label="Title"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />
  );
}

export { FormExample, ControlledInput };
