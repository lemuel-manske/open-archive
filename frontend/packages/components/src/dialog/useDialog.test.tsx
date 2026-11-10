import { expect, test } from "@openarchive/config-playwright";

import { DialogHook } from "./useDialog.test-fixture";

test("useDialog opens a named native modal", async ({ render }) => {
  const dialog = await render(<DialogHook />);

  await expect(dialog).toBeVisible();

  await expect(dialog).toHaveAccessibleName("Example");
});
