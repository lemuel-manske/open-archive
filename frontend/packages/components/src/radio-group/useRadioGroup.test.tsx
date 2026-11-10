import { expect, test } from "@openarchive/config-playwright";

import { RadioGroupHook } from "./useRadioGroup.test-fixture";

test("useRadioGroup shares controlled selection with its items", async ({ render }) => {
  const group = await render(<RadioGroupHook />);

  await expect(group.getByRole("radio", { name: "Email" })).toBeChecked();
});
