import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources, { defaultLanguage, selectedLanguage } from './locales';

export type LocaleKey = 'EN' | 'FR';

i18next.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v4',
  lng: selectedLanguage,
  fallbackLng: defaultLanguage,
  ns: ['common', 'public'],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
