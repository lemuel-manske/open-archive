import { createElement } from 'react';

import { beforeMount } from '@playwright/experimental-ct-react/hooks';

import { Theme } from '@lemuel-manske/components';

import { archiveTheme } from '@lemuel-manske/design-tokens';

import '@lemuel-manske/components/styles.css';

import '../src/styles/global.css';

beforeMount(async ({ App }) =>
  createElement(Theme, { theme: archiveTheme, children: createElement(App) }),
);
