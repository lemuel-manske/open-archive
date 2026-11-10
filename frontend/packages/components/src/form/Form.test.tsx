import { expect, test } from "@openarchive/config-playwright";

import { Form } from "./Form";

import { FormExample, ControlledInput } from "./Form.test-fixture";

test("Form submits named input values", async ({ render }) => {
  const form = await render(<FormExample />);

  await form.getByRole("textbox", { name: "Website URL" }).fill("https://example.com");

  await form.getByRole("button", { name: "Save" }).click();

  await expect(form.getByRole("status")).toHaveText("https://example.com");
});

test("Form preserves native required validation", async ({ render }) => {
  const form = await render(<FormExample />);

  await form.getByRole("button", { name: "Save" }).click();

  await expect(form.getByRole("textbox")).toBeFocused();

  await expect(form.getByRole("status")).toBeEmpty();
});

test("Form label focuses its input", async ({ render }) => {
  const form = await render(<FormExample />);

  await form.getByText("Website URL", { exact: true }).click();

  await expect(form.getByRole("textbox")).toBeFocused();
});

test("Form.Input supports controlled values", async ({ render }) => {
  const input = await render(<ControlledInput />);

  await input.fill("Archive");

  await expect(input).toHaveValue("Archive");
});

test("Form.Input exposes validation feedback", async ({ render }) => {
  const form = await render(
    <Form>
      <Form.Input aria-label="URL" aria-invalid aria-describedby="error" />

      <p id="error">Enter a valid URL.</p>
    </Form>,
  );

  await expect(form.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");

  await expect(form.getByRole("textbox")).toHaveAccessibleDescription("Enter a valid URL.");
});

test("Form.Input supports read-only values", async ({ render }) => {
  const input = await render(<Form.Input aria-label="Title" readOnly value="Archive" />);

  await expect(input).not.toBeEditable();
});

test("Form.Textarea accepts multiline text", async ({ render }) => {
  const input = await render(<Form.Textarea aria-label="Notes" />);

  await input.fill("First line\nSecond line");

  await expect(input).toHaveValue("First line\nSecond line");
});

test("form controls have no accessibility violations", async ({ render, page }) => {
  await render(
    <Form aria-label="Capture">
      <Form.Label htmlFor="url">URL</Form.Label>

      <Form.Input id="url" required />

      <Form.Label htmlFor="notes">Notes</Form.Label>

      <Form.Textarea id="notes" />

      <Form.Label htmlFor="collection">Collection</Form.Label>

      <Form.Combobox id="collection">
        <Form.Combobox.Option value="reading">Reading</Form.Combobox.Option>
      </Form.Combobox>

      <Form.Button type="submit">
        <Form.Button.Label>Save</Form.Button.Label>
      </Form.Button>
    </Form>,
  );

  await expect(page).noAccessibilityViolations();
});
