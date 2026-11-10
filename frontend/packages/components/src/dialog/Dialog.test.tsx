import { expect, test } from "@openarchive/config-playwright";

import { DialogExample, ConditionalDialogExample } from "./Dialog.test-fixture";

test("Dialog focuses its first control when opened", async ({ render, page }) => {
  const example = await render(<DialogExample />);

  await example.getByRole("button", { name: "Edit name" }).click();

  await expect(page.getByRole("dialog", { name: "Edit name" }).getByRole("textbox")).toBeFocused();
});

test("Dialog restores focus after Escape", async ({ render, page }) => {
  const example = await render(<DialogExample />);

  await example.getByRole("button", { name: "Edit name" }).click();

  await page.keyboard.press("Escape");

  await expect(page.getByRole("dialog")).not.toBeVisible();

  await expect(example.getByRole("button", { name: "Edit name" })).toBeFocused();
});

test("Dialog keeps keyboard focus inside the modal", async ({ render, page }) => {
  const example = await render(<DialogExample />);

  await example.getByRole("button", { name: "Edit name" }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Close" }).focus();

  await page.keyboard.press("Tab");

  await expect(example.getByRole("button", { name: "Edit name" })).not.toBeFocused();

  await page.keyboard.press("Tab");

  await expect(page.getByRole("dialog").getByRole("textbox")).toBeFocused();
});

test("Dialog closes through its close button", async ({ render, page }) => {
  const example = await render(<DialogExample />);

  await example.getByRole("button", { name: "Edit name" }).click();

  await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Dialog restores focus when it is unmounted on close", async ({ render }) => {
  const example = await render(<ConditionalDialogExample />);

  await example.getByRole("button", { name: "Edit name" }).click();

  await example.getByRole("dialog").getByRole("button", { name: "Close" }).click();

  await expect(example.getByRole("button", { name: "Edit name" })).toBeFocused();
});

test("Dialog has no accessibility violations", async ({ render, page }) => {
  const example = await render(<DialogExample />);

  await example.getByRole("button", { name: "Edit name" }).click();

  await expect(page).noAccessibilityViolations();
});
