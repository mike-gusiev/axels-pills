import { Target, Users, Award, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import JoinUs from '../components/JoinUs';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '5+', label: t('about.stats.years') },
    { value: '10K+', label: t('about.stats.hoursEconomized') },
    { value: '1M+', label: t('about.stats.reminders') },
    { value: '99%', label: t('about.stats.satisfaction') },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: t('about.values.mission.title'),
      description: t('about.values.mission.description'),
      color: 'blue',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('about.values.team.title'),
      description: t('about.values.team.description'),
      color: 'green',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('about.values.experience.title'),
      description: t('about.values.experience.description'),
      color: 'purple',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('about.values.coreValues.title'),
      description: t('about.values.coreValues.description'),
      color: 'red',
    },
  ];

  const colorClasses: Record<
    string,
    {
      bg: string;
      text: string;
      border: string;
      darkBg: string;
      darkBorder: string;
      darkText: string;
    }
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
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      darkBg: 'dark:bg-red-900/20',
      darkBorder: 'dark:border-red-800',
      darkText: 'dark:text-red-400',
    },
  };

  return (
    <div
      id="about"
      className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"
    >
      {/* Hero Section */}
      <section className="py-5 sm:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('about.title')}{' '}
            <span className="text-blue-600 dark:text-blue-400">
              {t('about.titleBrand')}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 sm:py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center border-2 border-blue-100 dark:border-blue-800 transition-colors duration-300"
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('about.valuesTitle')}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const colors = colorClasses[value.color];
              return (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border-2 ${colors.border} ${colors.darkBorder} ${colors.bg} ${colors.darkBg} hover:shadow-lg transition-all`}
                >
                  <div
                    className={`w-16 h-16 ${colors.bg} ${colors.darkBg} rounded-xl flex items-center justify-center ${colors.text} ${colors.darkText} mb-6 border ${colors.border} ${colors.darkBorder}`}
                  >
                    {value.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5 sm:py-20 px-6 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {t('about.storyTitle')}
          </h3>
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>{t('about.story.paragraph1')}</p>
            <p>{t('about.story.paragraph2')}</p>
            <p>{t('about.story.paragraph3')}</p>
          </div>
        </div>
      </section>

      <JoinUs />
    </div>
  );
};

export default About;
