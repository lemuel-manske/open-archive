import { expect, test } from "@openarchive/config-playwright";

import { CheckboxHook } from "./useCheckbox.test-fixture";

test("useCheckbox exposes disabled state", async ({ render }) => {
  const checkbox = await render(<CheckboxHook />);

  await expect(checkbox).toBeDisabled();
});
