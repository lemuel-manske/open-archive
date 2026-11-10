import { expect, test } from "@openarchive/config-playwright";

import { Combobox } from "./Combobox";

import { ComboboxAppearance } from "./options";

test("Combobox supports selecting an option", async ({ render }) => {
  const select = await render(
    <Combobox aria-label="Collection">
      <Combobox.Option value="reading">Reading</Combobox.Option>

      <Combobox.Option value="research">Research</Combobox.Option>
    </Combobox>,
  );

  await select.selectOption("research");

  await expect(select).toHaveValue("research");
});

test("Combobox.Option exposes disabled options", async ({ render }) => {
  const select = await render(
    <Combobox aria-label="Collection">
      <Combobox.Option value="reading">Reading</Combobox.Option>

      <Combobox.Option value="research" disabled>
        Research
      </Combobox.Option>
    </Combobox>,
  );

  await expect(select.getByRole("option", { name: "Research" })).toBeDisabled();
});

test("Combobox supports keyboard selection", async ({ render, page }) => {
  const select = await render(
    <Combobox aria-label="Collection">
      <Combobox.Option value="reading">Reading</Combobox.Option>

      <Combobox.Option value="research">Research</Combobox.Option>
    </Combobox>,
  );

  await select.focus();

  await page.keyboard.press("ArrowDown");

  await page.keyboard.press("End");

  await page.keyboard.press("Enter");

  await expect(select).toHaveValue("research");
});

test("Combobox supports the native appearance", async ({ render }) => {
  const select = await render(
    <Combobox aria-label="Collection" appearance={ComboboxAppearance.NATIVE}>
      <Combobox.Option value="reading">Reading</Combobox.Option>

      <Combobox.Option value="research">Research</Combobox.Option>
    </Combobox>,
  );

  await select.selectOption("research");

  await expect(select).toHaveValue("research");
});

test("Combobox has no accessibility violations with its picker open", async ({ render, page }) => {
  const select = await render(
    <Combobox aria-label="Collection">
      <Combobox.Option value="reading">Reading</Combobox.Option>

      <Combobox.Option value="research">Research</Combobox.Option>
    </Combobox>,
  );

  await select.click();

  await expect(page).noAccessibilityViolations();
});
