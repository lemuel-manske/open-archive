import { expect, test } from "@openarchive/config-playwright";

import { AlertHook } from "./useAlert.test-fixture";

test("useAlert announces the whole message", async ({ render }) => {
  const alert = await render(<AlertHook />);

  await expect(alert).toHaveAttribute("aria-atomic", "true");
});
