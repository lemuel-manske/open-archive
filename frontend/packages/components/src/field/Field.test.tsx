import { expect, test } from "@openarchive/config-playwright";

import { Field } from "./Field";

import { Input } from "../input/Input";

import { ConditionalError } from "./Field.test-fixture";

test("Field associates its label with the control", async ({ render }) => {
  const field = await render(
    <Field>
      <Field.Label>Name</Field.Label>

      <Field.Control>
        <Input />
      </Field.Control>
    </Field>,
  );

  await field.getByText("Name", { exact: true }).click();

  await expect(field.getByRole("textbox", { name: "Name" })).toBeFocused();
});

test("Field composes descriptions with validation feedback", async ({ render }) => {
  const example = await render(<ConditionalError />);

  await expect(example.getByRole("textbox")).toHaveAccessibleDescription(
    "Visible to your team. Use your full name. Name is required.",
  );

  await expect(example.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
});

test("Field removes references to unmounted errors", async ({ render }) => {
  const example = await render(<ConditionalError />);

  await example.getByRole("button", { name: "Clear error" }).click();

  await expect(example.getByRole("textbox")).toHaveAccessibleDescription(
    "Visible to your team. Use your full name.",
  );

  await expect(example.getByRole("textbox")).not.toHaveAttribute("aria-invalid", "true");
});

test("Field propagates required state", async ({ render }) => {
  const field = await render(
    <Field required>
      <Field.Label>Name</Field.Label>

      <Field.Control>
        <Input />
      </Field.Control>
    </Field>,
  );

  await expect(field.getByRole("textbox")).toHaveAttribute("required", "");
});

test("Field propagates disabled state", async ({ render }) => {
  const field = await render(
    <Field disabled>
      <Field.Label>Name</Field.Label>

      <Field.Control>
        <Input />
      </Field.Control>
    </Field>,
  );

  await expect(field.getByRole("textbox")).toBeDisabled();
});

test("Field has no accessibility violations", async ({ render, page }) => {
  await render(<ConditionalError />);

  await expect(page).noAccessibilityViolations();
});
