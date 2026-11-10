import { expect, test } from "@openarchive/config-playwright";

import { LinkHook } from "./useLink.test-fixture";

test("useLink preserves relations while isolating new tabs", async ({ render }) => {
  const link = await render(<LinkHook />);

  await expect(link).toHaveAttribute("rel", "external noopener noreferrer");
});
