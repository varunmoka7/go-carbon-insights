
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from './resources';

const supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    
    detection: {
      order: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    ns: ['common', 'navigation', 'dashboard', 'industry', 'scopes', 'languages', 'errors'],
    defaultNS: 'common',

    react: {
      useSuspense: false,
    },
  });

export default i18n;
