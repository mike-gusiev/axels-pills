import { ArrowRight } from 'lucide-react';
import { getDate } from '../utils';
interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Ваші ліки
            <br />
            <span className="text-blue-600">під контролем</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Вказуйте коли приймаєте ліки — вранці, вдень чи ввечері. Завжди
            знайте, на скільки вистачить запасу.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Почати користування
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
            >
              Дізнатися більше
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-blue-600">5K+</div>
              <div className="text-sm text-gray-600">Активних користувачів</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Нагадувань щодня</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-600">
                Вчасно прийнятих ліків
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image Placeholder */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Запас ліків</h3>
                <p className="text-sm text-gray-500">Омега-3</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Вистачить на</span>
                <span className="text-2xl font-bold text-blue-600">
                  14 днів
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Всього</span>
                <span className="text-lg font-semibold text-gray-900">
                  30 шт
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="text-lg">📅</span>
                <span className="font-semibold">Сьогодні, {getDate()}</span>
              </div>

              <div className="space-y-2">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                  <div className="text-xs text-yellow-700 font-semibold">
                    Ранок • 08:00
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Вітамін D • 2000 МО
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <div className="text-xs text-blue-700 font-semibold">
                    День • 14:00
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Магній B6 • 1 таб
                  </div>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded">
                  <div className="text-xs text-purple-700 font-semibold">
                    Вечір • 21:00
                  </div>
                  <div className="text-sm font-medium mt-1">
                    Мелатонін • 3 мг
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
