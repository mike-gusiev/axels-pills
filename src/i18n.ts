import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk.json';
import en from './locales/en.json';

// Получаем сохраненный язык из localStorage или используем украинский по умолчанию
const savedLanguage = localStorage.getItem('language') || 'uk';

i18n.use(initReactI18next).init({
  resources: {
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: savedLanguage, // Используем сохраненный язык
  fallbackLng: 'uk',
  interpolation: {
    escapeValue: false,
  },
});

// Сохраняем язык при его изменении
i18n.on('languageChanged', lng => {
  localStorage.setItem('language', lng);
});

export default i18n;
