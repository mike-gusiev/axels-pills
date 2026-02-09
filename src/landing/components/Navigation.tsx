import { Pill, Menu, X, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useState, useRef, useEffect } from 'react';

interface NavigationProps {
  onGetStarted: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Navigation = ({ onGetStarted }: NavigationProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isMobileLangDropdownOpen, setIsMobileLangDropdownOpen] =
    useState(false);
  const [isMobileThemeDropdownOpen, setIsMobileThemeDropdownOpen] =
    useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLangDropdownRef = useRef<HTMLDivElement>(null);
  const mobileThemeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsThemeDropdownOpen(false);
      }
      if (
        mobileLangDropdownRef.current &&
        !mobileLangDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileLangDropdownOpen(false);
      }
      if (
        mobileThemeDropdownRef.current &&
        !mobileThemeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileThemeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    setIsThemeDropdownOpen(false);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    navigate('/login');
  };

  const getLanguageLabel = () => {
    return i18n.language === 'uk' ? '🇺🇦 Українська' : '🇬🇧 English';
  };

  const getThemeLabel = () => {
    return theme === 'light'
      ? `☀️ ${t('navigation.lightTheme')}`
      : `🌙 ${t('navigation.darkTheme')}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <Pill className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Axels Pills
            </span>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Dropdown */}
            <div ref={langDropdownRef} className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer flex items-center gap-2 min-w-[160px]"
              >
                <span className="flex-1 text-left">{getLanguageLabel()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isLangDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => handleLanguageChange('uk')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === 'uk'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    🇺🇦 Українська
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === 'en'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>

            {/* Theme Dropdown */}
            <div ref={themeDropdownRef} className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer flex items-center gap-2 min-w-[140px]"
              >
                <span className="flex-1 text-left">{getThemeLabel()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isThemeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isThemeDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      theme === 'light'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    ☀️ {t('navigation.lightTheme')}
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    🌙 {t('navigation.darkTheme')}
                  </button>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              {t('navigation.login')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* Language Dropdown */}
            <div ref={mobileLangDropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('navigation.language')}
              </label>
              <button
                onClick={() =>
                  setIsMobileLangDropdownOpen(!isMobileLangDropdownOpen)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{getLanguageLabel()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isMobileLangDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isMobileLangDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      handleLanguageChange('uk');
                      setIsMobileLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === 'uk'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    🇺🇦 Українська
                  </button>
                  <button
                    onClick={() => {
                      handleLanguageChange('en');
                      setIsMobileLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      i18n.language === 'en'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              )}
            </div>

            {/* Theme Dropdown */}
            <div ref={mobileThemeDropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('navigation.theme')}
              </label>
              <button
                onClick={() =>
                  setIsMobileThemeDropdownOpen(!isMobileThemeDropdownOpen)
                }
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{getThemeLabel()}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isMobileThemeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isMobileThemeDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      handleThemeChange('light');
                      setIsMobileThemeDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      theme === 'light'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    ☀️ {t('navigation.lightTheme')}
                  </button>
                  <button
                    onClick={() => {
                      handleThemeChange('dark');
                      setIsMobileThemeDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      theme === 'dark'
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    🌙 {t('navigation.darkTheme')}
                  </button>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              {t('navigation.login')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
