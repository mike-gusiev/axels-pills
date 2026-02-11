import { User, Pill, Package, History, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const Header = ({
  currentPage,
  setCurrentPage,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg mb-6 px-6 py-4">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Pill className="mr-3 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Axels Pills</span>
            <span className="sm:hidden">Pills</span>
          </h1>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              onClick={async () => {
                try {
                  const { signOut } = await import('firebase/auth');
                  const { auth } = await import('../firebase');
                  await signOut(auth);
                  navigate('/', { replace: true });
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
              className="px-4 py-2 rounded-md font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {t('home.logout')}
            </button>
          </div>

          {/* Mobile burger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('home.settings')}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <button
                onClick={async () => {
                  try {
                    const { signOut } = await import('firebase/auth');
                    const { auth } = await import('../firebase');
                    await signOut(auth);
                    navigate('/', { replace: true });
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                }}
                className="w-full px-4 py-2 rounded-md font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-left"
              >
                {t('home.logout')}
              </button>
            </div>
          </div>
        )}
      </div>

      <nav className="flex flex-wrap gap-2">
        <button
          onClick={() => setCurrentPage('patients')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentPage === 'patients'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <User className="w-4 h-4 inline-block mr-2" />
          {t('home.tabs.patients')}
        </button>
        <button
          onClick={() => setCurrentPage('medications')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentPage === 'medications'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Package className="w-4 h-4 inline-block mr-2" />
          {t('home.tabs.medications')}
        </button>
        <button
          onClick={() => setCurrentPage('history')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentPage === 'history'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <History className="w-4 h-4 inline-block mr-2" />
          {t('home.tabs.history')}
        </button>
      </nav>
    </div>
  );
};

export default Header;
