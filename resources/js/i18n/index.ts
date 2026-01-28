import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import kuTranslations from '../locales/ku.json';
import arTranslations from '../locales/ar.json';

// Get saved language from localStorage or use default (Kurdish)
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  return savedLanguage && ['en', 'ku', 'ar'].includes(savedLanguage) ? savedLanguage : 'ku';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      ku: {
        translation: kuTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    lng: getInitialLanguage(), // Use saved language or default (Kurdish)
    fallbackLng: 'ku', // fallback language (Kurdish)
    debug: false, // Disable i18n debug logs to suppress missing key warnings
    
    // Suppress missing key warnings
    saveMissing: false,
    updateMissing: false,
    missingKeyHandler: () => {
      // Suppress missing key warnings - do nothing
      return undefined;
    },
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      cookieMinutes: 10080, // 7 days
      cookieDomain: 'localhost',
      cookieOptions: { path: '/', sameSite: 'strict' }
    },
  });

export default i18n;
