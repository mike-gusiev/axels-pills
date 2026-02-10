import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={
        i18n.language === 'uk'
          ? 'Switch to English'
          : 'Перемкнути на українську'
      }
    >
      <Languages className="w-5 h-5" />
      <span className="text-sm font-medium">
        {i18n.language === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
