import { Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  onGetStarted: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Navigation = ({ onGetStarted }: NavigationProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('light');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
    // Здесь можно добавить логику для смены темы
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Pill className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Axels Pills</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Language Select */}
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="uk">🇺🇦 Українська</option>
              <option value="en">🇬🇧 English</option>
            </select>

            {/* Theme Select */}
            <select
              value={theme}
              onChange={handleThemeChange}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="light">☀️ {t('navigation.lightTheme')}</option>
              <option value="dark">🌙 {t('navigation.darkTheme')}</option>
            </select>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              {t('navigation.login')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
