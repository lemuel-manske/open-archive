import { expect, test } from "@openarchive/config-playwright";

import { Text } from "./Text";

test("Text renders its content", async ({ render }) => {
  const content = await render(<Text as="span">Example</Text>);

  await expect(content).toHaveText("Example");
});

test("Text has no accessibility violations", async ({ render, page }) => {
  await render(<Text>Example</Text>);

  await expect(page).noAccessibilityViolations();
});
