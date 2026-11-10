import { expect, test } from "@openarchive/config-playwright";

import { ConfirmationHook } from "./useConfirmationDialog.test-fixture";

test("useConfirmationDialog closes after a successful action", async ({ render }) => {
  const confirmation = await render(<ConfirmationHook />);

  await confirmation.getByRole("button").click();

  await expect(confirmation.getByRole("status")).toHaveText("Fechado");
});
