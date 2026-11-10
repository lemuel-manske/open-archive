import { expect, test } from "@openarchive/config-playwright";

import { ArchiveLayout } from "./ArchiveLayout";

test("ArchiveLayout skips navigation with the keyboard", async ({ render, page }) => {
  const layout = await render(<ArchiveLayout>Conteúdo</ArchiveLayout>);

  await page.keyboard.press("Tab");

  await page.keyboard.press("Enter");

  await expect(layout.getByRole("main")).toBeFocused();
});
