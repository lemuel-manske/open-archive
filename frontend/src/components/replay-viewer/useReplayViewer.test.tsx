import { expect, test } from '@lemuel-manske/config-playwright';

import { ReplayViewerHook } from './useReplayViewer.test-fixture';

test('useReplayViewer resolves the selected archive source', async ({ render }) => {
  const viewer = await render(<ReplayViewerHook />);

  await expect(viewer.getByRole('link', { name: 'Arquivo' })).toHaveAttribute(
    'href',
    '/captures/capture-1/archive',
  );
});
