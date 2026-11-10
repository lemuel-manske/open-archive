import { expect, test } from "@openarchive/config-playwright";

import { Label } from "./Label";

test("Label has no accessibility violations", async ({ render, page }) => {
  await render(
    <>
      <Label htmlFor="collection">Collection name</Label>

      <input id="collection" />
    </>,
  );

  await expect(page).noAccessibilityViolations();
});

test("Label focuses its associated field when clicked", async ({ render }) => {
  const component = await render(
    <>
      <Label htmlFor="collection">Collection name</Label>

      <input id="collection" />
    </>,
  );

  await component.getByText("Collection name").click();

  await expect(component.getByRole("textbox", { name: "Collection name" })).toBeFocused();
});

test("Label names a field nested inside it", async ({ render }) => {
  const label = await render(
    <Label>
      Collection name
      <input />
    </Label>,
  );

  await expect(label.getByRole("textbox", { name: "Collection name" })).toBeVisible();
});
