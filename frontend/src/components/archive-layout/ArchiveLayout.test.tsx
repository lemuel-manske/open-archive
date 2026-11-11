import { expect, test } from '@lemuel-manske/config-playwright';

import { ArchiveLayout } from './ArchiveLayout';

test('ArchiveLayout preserves the hero message as an accessible heading', async ({ render }) => {
  const layout = await render(<ArchiveLayout>Conteúdo</ArchiveLayout>);

  await expect(layout.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'A web muda. Suas capturas permanecem.',
  );
});

test('ArchiveLayout skips navigation with the keyboard', async ({ render, page }) => {
  const layout = await render(<ArchiveLayout>Conteúdo</ArchiveLayout>);

  await page.keyboard.press('Tab');

  await page.keyboard.press('Enter');

  await expect(layout.getByRole('main')).toBeFocused();
});
