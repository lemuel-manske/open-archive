import { expect, test } from "@openarchive/config-playwright";

import { SpinnerHook } from "./useSpinner.test-fixture";

test("useSpinner provides a default loading message", async ({ render }) => {
  const spinner = await render(<SpinnerHook />);

  await expect(spinner).toHaveText("Loading");
});
