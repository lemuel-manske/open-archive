import { expect, test } from '@lemuel-manske/config-playwright';

import { mockArchiveApi } from '../App.test-fixture';

import { completedCapture } from '../types/capture.test-fixture';

import { ArchiveHook } from './useArchive.test-fixture';

test('useArchive selects a capture for replay', async ({ render, page }) => {
  await mockArchiveApi(page);

  const archive = await render(<ArchiveHook />);

  await archive.getByRole('button', { name: 'Selecionar' }).click();

  await expect(archive.getByRole('status')).toHaveText(completedCapture.url);
});

test('useArchive clears the selected capture on close', async ({ render, page }) => {
  await mockArchiveApi(page);

  const archive = await render(<ArchiveHook />);

  await archive.getByRole('button', { name: 'Selecionar' }).click();

  await archive.getByRole('button', { name: 'Fechar' }).click();

  await expect(archive.getByRole('status')).toHaveText('Nenhuma captura selecionada.');
});
