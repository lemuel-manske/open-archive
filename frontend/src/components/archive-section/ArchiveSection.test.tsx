import { expect, test } from '@lemuel-manske/config-playwright';

import { ArchiveSection } from './ArchiveSection';

test('ArchiveSection uses its heading as an accessible name', async ({ render }) => {
  const section = await render(
    <ArchiveSection id="collection" title="Coleção">
      Capturas
    </ArchiveSection>,
  );

  await expect(section.getByRole('region')).toHaveAccessibleName('Coleção');
});
