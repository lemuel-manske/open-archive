import { expect, test } from "@openarchive/config-playwright";

import { LegendHook } from "./useLegend.test-fixture";

test("useLegend names its fieldset", async ({ render }) => {
  const fieldset = await render(<LegendHook />);

  await expect(fieldset).toHaveAccessibleName("Contact");
});
