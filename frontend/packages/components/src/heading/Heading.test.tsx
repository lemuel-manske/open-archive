import { expect, test } from "@openarchive/config-playwright";

import { Heading } from "./Heading";

import { HeadingWeight } from "./options";

test("Heading renders its content", async ({ render, page }) => {
  await render(
    <Heading level={3} weight={HeadingWeight.SEMIBOLD}>
      Example
    </Heading>,
  );

  await expect(page.getByRole("heading", { level: 3, name: "Example" })).toBeVisible();
});

test("Heading has no accessibility violations", async ({ render, page }) => {
  await render(<Heading>Example</Heading>);

  await expect(page).noAccessibilityViolations();
});
