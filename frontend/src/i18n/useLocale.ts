import { createContext, useContext } from 'react';

import { defaultLocale } from './translator';

import type { AppLocale } from './translator';

const LocaleContext = createContext<AppLocale>(defaultLocale);

function useLocale() {
  return useContext(LocaleContext);
}

export { LocaleContext, useLocale };
