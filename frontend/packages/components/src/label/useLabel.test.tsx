import { expect, test } from "@openarchive/config-playwright";

import { LabelHook } from "./useLabel.test-fixture";

test("useLabel associates its label with a field", async ({ render }) => {
  const component = await render(
    <>
      <LabelHook htmlFor="collection">Collection name</LabelHook>

      <input id="collection" />
    </>,
  );

  await expect(component.getByRole("textbox", { name: "Collection name" })).toBeVisible();
});

test("useLabel preserves an explicit id", async ({ render }) => {
  const label = await render(<LabelHook id="collection-label">Collection name</LabelHook>);

  await expect(label).toHaveAttribute("id", "collection-label");
});
