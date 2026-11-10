import { expect, test } from "@openarchive/config-playwright";

import { InputHook } from "./useInput.test-fixture";

test("useInput provides native disabled behavior", async ({ render }) => {
  const control = await render(<InputHook aria-label="Name" disabled />);

  await expect(control).toBeDisabled();
});

test("useInput preserves the accessible name", async ({ render }) => {
  const control = await render(<InputHook aria-label="Name" />);

  await expect(control).toHaveAccessibleName("Name");
});
