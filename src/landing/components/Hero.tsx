import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDate } from '../utils';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  const { t } = useTranslation();

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            {t('hero.title').split(' ').slice(0, 2).join(' ')}
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              {t('hero.title').split(' ').slice(2).join(' ')}
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {t('hero.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToAbout}
              className="bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all border-2 border-gray-200"
            >
              {t('hero.learnMore')}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                5K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {' '}
                {t('about.stats.users')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                10K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('about.stats.reminders')}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {t('hero.onTime')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image Placeholder */}
        <div className="relative">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-8 space-y-6 transition-colors duration-300">
            <div className="flex items-center gap-3 pb-4 border-b dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">💊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {' '}
                  {t('hero.pillsReserve')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('hero.omega')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  {t('hero.enough')}
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {t('hero.14days')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">
                  {t('hero.total')}
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('hero.pieces')}
                </span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <span className="text-lg">📅</span>
                <span className="font-semibold">
                  {t('hero.today')}, {getDate()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-3 rounded">
                  <div className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">
                    {t('hero.morning')}
                  </div>
                  <div className="text-sm font-medium mt-1 dark:text-gray-200">
                    {t('hero.vitaminD')}
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 p-3 rounded">
                  <div className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                    {t('hero.afternoon')}
                  </div>
                  <div className="text-sm font-medium mt-1 dark:text-gray-200">
                    {t('hero.magnesiumB6')}
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-400 p-3 rounded">
                  <div className="text-xs text-purple-700 dark:text-purple-400 font-semibold">
                    {t('hero.evening')}
                  </div>
                  <div className="text-sm font-medium mt-1 dark:text-gray-200">
                    {t('hero.melatonin')}
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
