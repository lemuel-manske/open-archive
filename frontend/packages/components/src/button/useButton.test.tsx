import { expect, test } from "@openarchive/config-playwright";

import { ButtonHook } from "./useButton.test-fixture";

test("useButton provides native disabled behavior", async ({ render }) => {
  const button = await render(<ButtonHook disabled>Save</ButtonHook>);

  await expect(button).toBeDisabled();
});

test("useButton provides the accessible disabled state", async ({ render }) => {
  const button = await render(<ButtonHook disabled>Save</ButtonHook>);

  await expect(button).toHaveAttribute("aria-disabled", "true");
});

test("useButton preserves an accessible name", async ({ render }) => {
  const button = await render(<ButtonHook aria-label="Save collection">Save</ButtonHook>);

  await expect(button).toHaveAccessibleName("Save collection");
});
