import { expect, test } from "@openarchive/config-playwright";

import { RadioGroup } from "./RadioGroup";

import { Button } from "../button/Button";

import { ControlledRadioGroup } from "./RadioGroup.test-fixture";

test("RadioGroup supports arrow-key selection", async ({ render }) => {
  const group = await render(
    <RadioGroup label="Contact method" defaultValue="email">
      <RadioGroup.Item value="email">Email</RadioGroup.Item>

      <RadioGroup.Item value="phone">Phone</RadioGroup.Item>
    </RadioGroup>,
  );

  await group.getByRole("radio", { name: "Email" }).press("ArrowDown");

  await expect(group.getByRole("radio", { name: "Phone" })).toBeChecked();

  await expect(group.getByRole("radio", { name: "Email" })).not.toBeChecked();
});

test("RadioGroup supports controlled selection", async ({ render }) => {
  const group = await render(<ControlledRadioGroup />);

  await group.getByRole("radio", { name: "Phone" }).check();

  await expect(group.getByRole("radio", { name: "Phone" })).toBeChecked();
});

test("RadioGroup resets to its default selection", async ({ render }) => {
  const form = await render(
    <form>
      <RadioGroup label="Contact method" defaultValue="email">
        <RadioGroup.Item value="email">Email</RadioGroup.Item>

        <RadioGroup.Item value="phone">Phone</RadioGroup.Item>
      </RadioGroup>

      <Button type="reset">Reset</Button>
    </form>,
  );

  await form.getByRole("radio", { name: "Phone" }).check();

  await form.getByRole("button").click();

  await expect(form.getByRole("radio", { name: "Email" })).toBeChecked();
});

test("RadioGroup disables all items", async ({ render }) => {
  const group = await render(
    <RadioGroup label="Contact method" disabled>
      <RadioGroup.Item value="email">Email</RadioGroup.Item>
    </RadioGroup>,
  );

  await expect(group.getByRole("radio")).toBeDisabled();
});

test("RadioGroup has no accessibility violations", async ({ render, page }) => {
  await render(<ControlledRadioGroup />);

  await expect(page).noAccessibilityViolations();
});
