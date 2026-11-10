import { expect, test } from "@openarchive/config-playwright";

import { FormHook } from "./useForm.test-fixture";

test("useForm preserves the accessible form name", async ({ render }) => {
  const form = await render(<FormHook aria-label="Capture">Content</FormHook>);

  await expect(form).toHaveAccessibleName("Capture");
});
