'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, Translations, translations } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'alaris_locale';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  // Initialize locale on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === 'ar' || saved === 'en') {
        setLocaleState(saved);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setMounted(true);
  }, []);

  // Update DOM attributes whenever locale changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const dir = locale === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', locale);

      try {
        localStorage.setItem(STORAGE_KEY, locale);
        document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {
        // Ignore storage errors
      }
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isRtl = locale === 'ar';
  const currentTranslations = translations[locale] || translations.en;

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        toggleLocale,
        dir,
        isRtl,
        t: currentTranslations,
      }}
    >
      <div dir={dir} className={isRtl ? 'font-arabic' : ''}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    // Fallback safe defaults if used outside provider during SSR
    return {
      locale: 'en',
      setLocale: () => {},
      toggleLocale: () => {},
      dir: 'ltr',
      isRtl: false,
      t: translations.en,
    };
  }
  return context;
}
