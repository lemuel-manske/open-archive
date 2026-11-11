import { AppI18n } from '../src/i18n/AppI18n';

import { createElement } from 'react';

import { beforeMount } from '@playwright/experimental-ct-react/hooks';

import { Theme } from '@lemuel-manske/components';

import { openArchiveTheme } from '../src/styles/theme';

import '@lemuel-manske/components/styles.css';

import '../src/styles/global.css';

beforeMount(async ({ App }) =>
  createElement(AppI18n, {
    children: createElement(Theme, { theme: openArchiveTheme, children: createElement(App) }),
  }),
);
