import { expect, test } from "@openarchive/config-playwright";

import { Checkbox } from "./Checkbox";

import { ControlledCheckbox } from "./Checkbox.test-fixture";

test("Checkbox toggles with Space", async ({ render }) => {
  const checkbox = await render(<Checkbox>Subscribe</Checkbox>);

  await checkbox.getByRole("checkbox").press("Space");

  await expect(checkbox.getByRole("checkbox")).toBeChecked();
});

test("Checkbox supports controlled state", async ({ render }) => {
  const checkbox = await render(<ControlledCheckbox />);

  await checkbox.getByRole("checkbox").check();

  await expect(checkbox.getByRole("checkbox")).toBeChecked();
});

test("disabled Checkbox is not editable", async ({ render }) => {
  const checkbox = await render(<Checkbox disabled>Subscribe</Checkbox>);

  await expect(checkbox.getByRole("checkbox")).toBeDisabled();
});

test("Checkbox has no accessibility violations", async ({ render, page }) => {
  await render(<Checkbox>Subscribe</Checkbox>);

  await expect(page).noAccessibilityViolations();
});
