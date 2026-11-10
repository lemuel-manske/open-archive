import { expect, test } from "@openarchive/config-playwright";

import { FieldHook } from "./useField.test-fixture";

test("useField supplies a stable explicit control association", async ({ render }) => {
  const field = await render(<FieldHook />);

  await expect(field.getByRole("textbox", { name: "Name" })).toHaveAttribute("id", "name");
});
