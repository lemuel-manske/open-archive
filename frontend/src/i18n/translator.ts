import { createTranslator } from '@lemuel-manske/i18n';

import en from '../../locales/en.json';

import ptBR from '../../locales/pt-BR.json';

const defaultLocale = 'pt-BR';

type AppLocale = 'en' | 'pt-BR';

function createAppTranslator(locale: AppLocale = defaultLocale) {
  return createTranslator({
    locale,
    defaultLocale,
    defaultMessages: ptBR,
    catalogs: { en },
  });
}

export { createAppTranslator, defaultLocale };

export type { AppLocale };
