import { expect, test } from "@openarchive/config-playwright";

import { Fieldset, Legend } from "./Fieldset";

import { Input } from "../input/Input";

test("Legend names its fieldset", async ({ render }) => {
  const fieldset = await render(
    <Fieldset>
      <Legend>Contact details</Legend>

      <Input aria-label="Email" />
    </Fieldset>,
  );

  await expect(fieldset).toHaveAccessibleName("Contact details");
});

test("Fieldset disables its controls", async ({ render }) => {
  const fieldset = await render(
    <Fieldset disabled>
      <Legend>Contact details</Legend>

      <Input aria-label="Email" />
    </Fieldset>,
  );

  await expect(fieldset.getByRole("textbox")).toBeDisabled();
});

test("Fieldset has no accessibility violations", async ({ render, page }) => {
  await render(
    <Fieldset>
      <Legend>Contact details</Legend>

      <Input aria-label="Email" />
    </Fieldset>,
  );

  await expect(page).noAccessibilityViolations();
});
