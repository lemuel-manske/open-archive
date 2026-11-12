import type { Page } from '@lemuel-manske/config-playwright';

import type { BrowserProfile, Capture } from './types/capture';

import { completedCapture, runningLogin, savedProfile } from './types/capture.test-fixture';

async function mockArchiveApi(
  page: Page,
  initialCaptures: Capture[] = [completedCapture],
  initialProfiles: BrowserProfile[] = [],
) {
  let captures = initialCaptures;

  let profiles = initialProfiles;

  await page.route('**/captures**', async (route) => {
    const request = route.request();

    if (request.method() === 'DELETE') {
      const id = decodeURIComponent(new URL(request.url()).pathname.split('/').at(-1) ?? '');

      captures = captures.filter((capture) => capture._id !== id);

      await route.fulfill({ status: 204 });

      return;
    }

    if (request.method() === 'POST') {
      const data = request.postDataJSON();

      captures = [
        { ...completedCapture, ...data, _id: 'new-capture', status: 'pending' },
        ...captures,
      ];

      await route.fulfill({ json: { id: 'new-capture', status: 'pending' } });

      return;
    }

    await route.fulfill({ json: captures });
  });

  await page.route('**/profiles**', async (route) => {
    if (route.request().method() === 'DELETE') {
      const id = decodeURIComponent(
        new URL(route.request().url()).pathname.split('/').at(-1) ?? '',
      );

      profiles = profiles.filter((profile) => profile._id !== id);

      await route.fulfill({ status: 204 });

      return;
    }

    await route.fulfill({ json: profiles });
  });

  await page.route('**/login-sessions**', (route) => route.fulfill({ status: 404 }));
}

async function mockCompletedLogin(page: Page) {
  let completed = false;

  let releaseProfiles: () => void = () => {};

  const profileResponse = new Promise<void>((resolve) => {
    releaseProfiles = resolve;
  });

  await page.route('**/profiles**', async (route) => {
    if (completed) await profileResponse;

    await route.fulfill({ json: completed ? [savedProfile] : [] });
  });

  await page.route('**/login-sessions**', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ json: runningLogin });

      return;
    }

    completed = true;

    await route.fulfill({
      json: { ...runningLogin, status: 'completed', profile_id: savedProfile._id },
    });
  });

  return releaseProfiles;
}

export { mockArchiveApi, mockCompletedLogin };
