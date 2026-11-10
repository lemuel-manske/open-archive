import { expect, test } from "@openarchive/config-playwright";

import { RadioGroupItemHook } from "./useRadioGroupItem.test-fixture";

test("useRadioGroupItem applies the initial selection", async ({ render }) => {
  const group = await render(<RadioGroupItemHook />);

  await expect(group.getByRole("radio", { name: "Email" })).toBeChecked();
});

test("useRadioGroupItem inherits the disabled group state", async ({ render }) => {
  const group = await render(<RadioGroupItemHook disabled />);

  await expect(group.getByRole("radio", { name: "Email" })).toBeDisabled();
});
