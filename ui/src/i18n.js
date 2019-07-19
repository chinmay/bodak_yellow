import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

const options = {
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en-US',
  ns: ['translations'], // have a common namespace used around the full app
  defaultNS: 'translations',
  keySeparator: false, // we use content as keys
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ','
  },
  react: {
    wait: true
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  // Add new language translations to this whitelisted array; prevents bad fetches
  whitelist: ['en', 'en-US']
};
i18n
  .use(XHR)
  .use(LanguageDetector)
  .init(options);

export default i18n;
