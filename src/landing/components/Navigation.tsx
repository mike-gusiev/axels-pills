import { Pill, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface NavigationProps {
  onGetStarted: () => void;
}

const Navigation = ({ onGetStarted }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleFeaturesClick = () => {
    if (location.pathname === '/') {
      const element = document.getElementById('features');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/', { state: { scrollTo: 'features' } });
    }
    setIsMenuOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate('/')}
          >
            <Pill className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Axels Pills</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={handleFeaturesClick}
              className={`transition-colors font-medium ${
                isActive('/')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Можливості
            </button>
            <button
              onClick={() => handleNavigate('/about')}
              className={`transition-colors font-medium ${
                isActive('/about')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Про нас
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Логін
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleFeaturesClick}
                className={`text-left transition-colors font-medium py-2 ${
                  isActive('/')
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Можливості
              </button>
              <button
                onClick={() => handleNavigate('/about')}
                className={`text-left transition-colors font-medium py-2 ${
                  isActive('/about')
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Про нас
              </button>
              <button
                onClick={() => {
                  onGetStarted();
                  setIsMenuOpen(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md text-center max-w-[200px]"
              >
                Логін
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
