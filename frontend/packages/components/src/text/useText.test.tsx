import { expect, test } from "@openarchive/config-playwright";

import { TextHook } from "./useText.test-fixture";

test("useText preserves content semantics", async ({ render }) => {
  const content = await render(<TextHook />);

  await expect(content).toHaveText("Example");
});
