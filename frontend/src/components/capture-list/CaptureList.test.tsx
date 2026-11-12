import { expect, test } from '@lemuel-manske/config-playwright';

import { completedCapture } from '../../types/capture.test-fixture';

import { ArchiveLayout } from '../archive-layout/ArchiveLayout';

import { CaptureList } from './CaptureList';

import { captureListProps } from './CaptureList.test-fixture';

test('CaptureList filters archived URLs', async ({ render }) => {
  const collection = await render(<CaptureList {...captureListProps} />);

  await collection.getByRole('searchbox', { name: 'Buscar no acervo' }).fill('missing.example');

  await expect(collection.getByText('Nenhum site encontrado para esta busca.')).toBeVisible();
});

test('CaptureList selects a completed capture for replay', async ({ render }) => {
  let selected = '';

  const collection = await render(
    <CaptureList
      {...captureListProps}
      onSelect={(id) => {
        selected = id;
      }}
    />,
  );

  await collection.getByRole('button', { name: 'Reproduzir' }).click();

  await expect.poll(() => selected).toBe(completedCapture._id);
});

test('CaptureList requires confirmation before deletion', async ({ render }) => {
  let removed = '';

  const collection = await render(
    <CaptureList
      {...captureListProps}
      onDelete={async (id) => {
        removed = id;
        return true;
      }}
    />,
  );

  await collection.getByRole('button', { name: 'Excluir', exact: true }).click();

  await collection.getByRole('dialog').getByRole('button', { name: 'Cancelar' }).click();

  expect(removed).toBe('');
});

test('CaptureList blocks deletion while a capture is running', async ({ render }) => {
  const collection = await render(
    <CaptureList {...captureListProps} captures={[{ ...completedCapture, status: 'running' }]} />,
  );

  await expect(collection.getByRole('button', { name: 'Excluir' })).toBeDisabled();
});

test('CaptureList announces an ongoing capture', async ({ render }) => {
  const collection = await render(
    <CaptureList {...captureListProps} captures={[{ ...completedCapture, status: 'running' }]} />,
  );

  await expect(collection.getByRole('status').filter({ hasText: 'Capturando' })).toHaveText(
    'Capturando',
  );
});

test('CaptureList shows the capture date and time separately', async ({ render }) => {
  const collection = await render(<CaptureList {...captureListProps} />);

  await expect(collection.getByText('09/11/2026', { exact: true })).toBeVisible();
  await expect(collection.getByText('09:00:00', { exact: true })).toBeVisible();
});

test('CaptureList offers WACZ downloads for completed captures', async ({ render }) => {
  const collection = await render(<CaptureList {...captureListProps} />);

  await expect(collection.getByRole('link', { name: 'Baixar WACZ' })).toHaveAttribute(
    'href',
    '/captures/capture-1/archive',
  );
});

test('CaptureList identifies the website by domain and keeps the full URL accessible', async ({
  render,
}) => {
  const collection = await render(<CaptureList {...captureListProps} />);

  await expect(collection.getByRole('heading', { name: 'example.org', level: 3 })).toBeVisible();
  await expect(
    collection.getByRole('link', { name: completedCapture.url, exact: true }),
  ).toHaveAttribute('href', completedCapture.url);
});

test('CaptureList has no accessibility violations', async ({ render, page }) => {
  await render(
    <ArchiveLayout>
      <CaptureList {...captureListProps} />
    </ArchiveLayout>,
  );

  await expect(page).noAccessibilityViolations();
});

test('CaptureList shows versions in a timeline with the newest first', async ({ render }) => {
  const older = { ...completedCapture, _id: 'older', created_at: '2026-11-08T12:00:00Z' };

  const collection = await render(
    <CaptureList {...captureListProps} captures={[older, completedCapture]} />,
  );

  const timeline = collection.getByRole('list', { name: `Capturas de ${completedCapture.url}` });

  const versions = timeline.getByRole('listitem');

  await expect(versions).toHaveCount(2);

  await expect(versions.first().getByText('09/11/2026', { exact: true })).toBeVisible();
  await expect(versions.last().getByText('08/11/2026', { exact: true })).toBeVisible();
});

test('CaptureList exposes the selected capture as the current timeline item', async ({
  render,
}) => {
  const collection = await render(
    <CaptureList {...captureListProps} selectedId={completedCapture._id} />,
  );

  await expect(collection.getByRole('listitem')).toHaveAttribute('aria-current', 'true');

  await expect(collection.getByRole('button', { name: 'Em reprodução' })).toBeVisible();
});

test('CaptureList announces plural capture counts', async ({ render }) => {
  const collection = await render(
    <CaptureList
      {...captureListProps}
      captures={[completedCapture, { ...completedCapture, _id: 'older' }]}
    />,
  );

  await expect(collection.getByRole('status')).toHaveText('1 site preservado · 2 capturas');
});

test('CaptureList explains an empty archive', async ({ render }) => {
  const collection = await render(<CaptureList {...captureListProps} captures={[]} />);

  await expect(
    collection.getByText('Ainda não há capturas. Comece arquivando uma URL.'),
  ).toBeVisible();
});
