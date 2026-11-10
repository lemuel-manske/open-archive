import { expect, test } from "@openarchive/config-playwright";

import { Input } from "./Input";

import { Button } from "../button/Button";

test("Input supports native form reset", async ({ render }) => {
  const form = await render(
    <form>
      <Input aria-label="Name" defaultValue="Original" />

      <Button type="reset">Reset</Button>
    </form>,
  );

  await form.getByRole("textbox").fill("Changed");

  await form.getByRole("button").click();

  await expect(form.getByRole("textbox")).toHaveValue("Original");
});

test("Input has no accessibility violations", async ({ render, page }) => {
  await render(<Input aria-label="Name" />);

  await expect(page).noAccessibilityViolations();
});
