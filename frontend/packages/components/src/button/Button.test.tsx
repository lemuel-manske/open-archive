import { expect, test } from "@openarchive/config-playwright";

import { Button } from "./Button";
import { FormExample } from "./Button.test-fixture";
import { ButtonVariant } from "./options";

test("Button has no accessibility violations", async ({ render, page }) => {
  await render(<Button>Archive website</Button>);

  await expect(page).noAccessibilityViolations();
});

test("secondary Button has no accessibility violations", async ({ render, page }) => {
  await render(<Button variant={ButtonVariant.SECONDARY}>Archive website</Button>);

  await expect(page).noAccessibilityViolations();
});

test("tertiary Button has no accessibility violations", async ({ render, page }) => {
  await render(<Button variant={ButtonVariant.TERTIARY}>Archive website</Button>);

  await expect(page).noAccessibilityViolations();
});

test("Button handles a click", async ({ render }) => {
  let activations = 0;

  const button = await render(<Button onClick={() => activations++}>Save</Button>);

  await button.click();

  await expect.poll(() => activations).toBe(1);
});

test("Button activates with Enter", async ({ render }) => {
  let activations = 0;

  const button = await render(<Button onClick={() => activations++}>Save</Button>);

  await button.press("Enter");

  await expect.poll(() => activations).toBe(1);
});

test("Button activates with Space", async ({ render }) => {
  let activations = 0;

  const button = await render(<Button onClick={() => activations++}>Save</Button>);

  await button.press("Space");

  await expect.poll(() => activations).toBe(1);
});

test("Button can be reached with Tab", async ({ render, page }) => {
  const button = await render(<Button>Save</Button>);

  await page.keyboard.press("Tab");

  await expect(button).toBeFocused();
});

test("disabled Button does not activate", async ({ render }) => {
  let activations = 0;

  const button = await render(
    <Button disabled onClick={() => activations++}>
      Save
    </Button>,
  );

  await button.click({ force: true });

  expect(activations).toBe(0);
});

test("Button does not submit a form by default", async ({ render }) => {
  let submissions = 0;

  const form = await render(
    <FormExample onSubmit={() => submissions++}>
      <Button>Save</Button>
    </FormExample>,
  );

  await form.getByRole("button", { name: "Save" }).click();

  expect(submissions).toBe(0);
});

test("submit Button submits its form", async ({ render }) => {
  let submissions = 0;

  const form = await render(
    <FormExample onSubmit={() => submissions++}>
      <Button type="submit">Save</Button>
    </FormExample>,
  );

  await form.getByRole("button", { name: "Save" }).click();

  await expect.poll(() => submissions).toBe(1);
});

test("icon-only Button has an accessible name", async ({ render }) => {
  const button = await render(
    <Button aria-label="Close">
      <span aria-hidden="true">×</span>
    </Button>,
  );

  await expect(button).toHaveAccessibleName("Close");
});

test("Button.Label provides the button accessible name", async ({ render }) => {
  const button = await render(
    <Button>
      <Button.Label>Save website</Button.Label>
    </Button>,
  );

  await expect(button).toHaveAccessibleName("Save website");
});
