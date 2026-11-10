import { expect, test } from "@openarchive/config-playwright";

import { Alert } from "./Alert";

test("Alert uses a polite status by default", async ({ render }) => {
  const alert = await render(<Alert>Changes saved.</Alert>);

  await expect(alert).toHaveRole("status");
});

test("Alert supports urgent announcements", async ({ render }) => {
  const alert = await render(<Alert urgency="assertive">Unable to save changes.</Alert>);

  await expect(alert).toHaveRole("alert");
});

test("Alert has no accessibility violations", async ({ render, page }) => {
  await render(<Alert>Changes saved.</Alert>);

  await expect(page).noAccessibilityViolations();
});
