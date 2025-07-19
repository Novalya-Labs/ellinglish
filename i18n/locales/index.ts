import * as Localization from 'expo-localization';
import type { Resource } from 'i18next';
import type { LanguageCode } from '../types';
import EN from './en';
import FR from './fr';

const resources: Resource = {
  EN,
  FR,
};

export const selectedLanguage: LanguageCode = (Localization.getLocales()[0].languageCode as LanguageCode) ?? 'FR';
export const defaultLanguage: LanguageCode = 'FR';
export const supportedLanguages: LanguageCode[] = ['EN', 'FR'];

export default resources;
