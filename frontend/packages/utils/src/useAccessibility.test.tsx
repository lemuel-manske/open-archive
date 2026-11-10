import { expect, test } from "@openarchive/config-playwright";

import { AccessibilityButton } from "./useAccessibility.test-fixture";

test("useAccessibility generates an id", async ({ render }) => {
  const button = await render(<AccessibilityButton>Save</AccessibilityButton>);

  expect(await button.getAttribute("id")).toBeTruthy();
});

test("useAccessibility preserves an explicit id", async ({ render }) => {
  const button = await render(<AccessibilityButton id="save">Save</AccessibilityButton>);

  await expect(button).toHaveAttribute("id", "save");
});

test("useAccessibility keeps the id stable when rendering again", async ({ render }) => {
  const button = await render(<AccessibilityButton>Save</AccessibilityButton>);

  const id = await button.getAttribute("id");

  await button.update(<AccessibilityButton>Saved</AccessibilityButton>);

  await expect(button).toHaveAttribute("id", id!);
});

test("useAccessibility exposes the disabled state", async ({ render }) => {
  const button = await render(<AccessibilityButton disabled>Save</AccessibilityButton>);

  await expect(button).toHaveAttribute("aria-disabled", "true");
});

test("useAccessibility preserves an accessible name", async ({ render }) => {
  const button = await render(
    <AccessibilityButton aria-label="Save collection">Save</AccessibilityButton>,
  );

  await expect(button).toHaveAccessibleName("Save collection");
});
