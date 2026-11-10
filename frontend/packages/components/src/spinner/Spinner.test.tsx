import { expect, test } from "@openarchive/config-playwright";

import { Spinner } from "./Spinner";

test("Spinner exposes its loading message", async ({ render }) => {
  const spinner = await render(<Spinner label="Loading results" />);

  await expect(spinner).toHaveRole("status");

  await expect(spinner).toHaveText("Loading results");
});

test("Spinner has no accessibility violations", async ({ render, page }) => {
  await render(<Spinner />);

  await expect(page).noAccessibilityViolations();
});
