import { expect, test } from "@openarchive/config-playwright";

import { FieldsetHook } from "./useFieldset.test-fixture";

test("useFieldset disables its controls", async ({ render }) => {
  const fieldset = await render(<FieldsetHook />);

  await expect(fieldset.getByRole("textbox")).toBeDisabled();
});
