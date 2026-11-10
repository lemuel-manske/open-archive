import { expect, test } from "@openarchive/config-playwright";

import { Link } from "./Link";

test("Link exposes its destination", async ({ render }) => {
  const link = await render(<Link href="#details">Details</Link>);

  await expect(link).toHaveAttribute("href", "#details");
});

test("Link can be reached by keyboard", async ({ render, page }) => {
  const link = await render(<Link href="#details">Details</Link>);

  await page.keyboard.press("Tab");

  await expect(link).toBeFocused();
});

test("Link has no accessibility violations", async ({ render, page }) => {
  await render(<Link href="#details">Details</Link>);

  await expect(page).noAccessibilityViolations();
});
