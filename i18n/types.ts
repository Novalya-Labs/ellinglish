import 'i18next';
import type en from './locales/en';

export type Resources = typeof en;

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resources;
    returnNull: false;
  }
}

export type LanguageCode = 'EN' | 'FR';
