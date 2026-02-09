import { Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface NavigationProps {
  onGetStarted: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Navigation = ({ onGetStarted }: NavigationProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
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

          {/* CTA Button */}
          <button
            onClick={() => handleNavigate('/login')}
            className=" block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Логін
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => handleNavigate('/login')}
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
