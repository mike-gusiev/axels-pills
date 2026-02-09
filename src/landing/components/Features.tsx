import { Bell, Calendar, BarChart3, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Bell className="w-8 h-8" />,
      title: t('features.reminder.title'),
      description: t('features.reminder.description'),
      color: 'blue',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: t('features.schedule.title'),
      description: t('features.schedule.description'),
      color: 'green',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('features.history.title'),
      description: t('features.history.description'),
      color: 'purple',
    },
  ];

  const colorClasses: Record<
    string,
    { bg: string; text: string; border: string; darkBg: string; darkBorder: string; darkText: string }
  > = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      darkBg: 'dark:bg-blue-900/20',
      darkBorder: 'dark:border-blue-800',
      darkText: 'dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      darkBg: 'dark:bg-green-900/20',
      darkBorder: 'dark:border-green-800',
      darkText: 'dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      darkBg: 'dark:bg-purple-900/20',
      darkBorder: 'dark:border-purple-800',
      darkText: 'dark:text-purple-400',
    },
  };

  return (
    <section className=" py-5 sm:py-20 px-6 bg-white dark:bg-gray-900 scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Clock className="w-4 h-4" />
            {t('features.smartSchedule')}
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('features.mainTitle')}
            <br />
            <span className="text-blue-600 dark:text-blue-400">
              {t('features.mainTitleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('features.mainDescription')}
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('features.sectionTitle')}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            {t('features.sectionDescription')}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const colors = colorClasses[feature.color];
              return (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border-2 ${colors.border} ${colors.darkBorder} ${colors.bg} ${colors.darkBg} hover:shadow-lg transition-all`}
                >
                  <div
                    className={`w-16 h-16 ${colors.bg} ${colors.darkBg} rounded-xl flex items-center justify-center ${colors.text} ${colors.darkText} mb-6 border ${colors.border} ${colors.darkBorder}`}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
