import { useMemo } from 'react';

import type { ReactNode } from 'react';

import { I18nProvider } from '@lemuel-manske/i18n/react';

import { createAppTranslator, defaultLocale } from './translator';

import type { AppLocale } from './translator';

import { LocaleContext } from './useLocale';

interface AppI18nProps {
  children: ReactNode;

  locale?: AppLocale;
}

function AppI18n({ children, locale = defaultLocale }: AppI18nProps) {
  const translator = useMemo(() => createAppTranslator(locale), [locale]);

  return (
    <LocaleContext value={locale}>
      <I18nProvider translator={translator}>{children}</I18nProvider>
    </LocaleContext>
  );
}

export { AppI18n };
