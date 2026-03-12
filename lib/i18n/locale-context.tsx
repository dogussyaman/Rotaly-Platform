'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type Locale, type Translations, translations } from './translations';

interface LocaleContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LOCALE_STORAGE_KEY = 'stayhub_locale';

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'tr',
  t: translations.tr,
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr');

  useEffect(() => {
    // Hydrate locale from previous selection (client only).
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (stored && stored in translations) setLocaleState(stored);
    } catch {
      // Ignore storage errors (private mode, disabled storage, etc).
    }
  }, []);

  useEffect(() => {
    // Keep <html lang="…"> in sync for a11y and browser behaviors.
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
