import { expect, test } from "@openarchive/config-playwright";

import { ArchiveSection } from "./ArchiveSection";

test("ArchiveSection uses its heading as an accessible name", async ({ render }) => {
  const section = await render(
    <ArchiveSection id="collection" title="Coleção">
      Capturas
    </ArchiveSection>,
  );

  await expect(section).toHaveAccessibleName("Coleção");
});
