import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

console.log('initing i18n');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          Bank: 'Bank',
        },
      },
      mfPoke: {
        translations: {
          Bank: 'Brand Value',
        },
      },
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV !== 'production',
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    useSuspense: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
