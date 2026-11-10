import { expect, test } from "@openarchive/config-playwright";

import { HeadingHook } from "./useHeading.test-fixture";

test("useHeading preserves content semantics", async ({ render, page }) => {
  await render(<HeadingHook />);

  await expect(page.getByRole("heading", { level: 4, name: "Example" })).toBeVisible();
});
