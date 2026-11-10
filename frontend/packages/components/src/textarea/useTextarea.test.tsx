import { expect, test } from "@openarchive/config-playwright";

import { TextareaHook } from "./useTextarea.test-fixture";

test("useTextarea provides native disabled behavior", async ({ render }) => {
  const control = await render(<TextareaHook aria-label="Name" disabled />);

  await expect(control).toBeDisabled();
});

test("useTextarea preserves the accessible name", async ({ render }) => {
  const control = await render(<TextareaHook aria-label="Name" />);

  await expect(control).toHaveAccessibleName("Name");
});
