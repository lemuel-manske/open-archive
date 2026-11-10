import { expect, test } from "@openarchive/config-playwright";

import { Combobox } from "./Combobox";

import { ComboboxHook } from "./useCombobox.test-fixture";

test("useCombobox provides native disabled behavior", async ({ render }) => {
  const combobox = await render(
    <ComboboxHook aria-label="Collection" disabled>
      <Combobox.Option value="reading">Reading</Combobox.Option>
    </ComboboxHook>,
  );

  await expect(combobox).toBeDisabled();
});

test("useCombobox preserves the accessible name", async ({ render }) => {
  const combobox = await render(
    <ComboboxHook aria-label="Collection">
      <Combobox.Option value="reading">Reading</Combobox.Option>
    </ComboboxHook>,
  );

  await expect(combobox).toHaveAccessibleName("Collection");
});
