import { Bell, Calendar, BarChart3, Clock } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Нагадування',
      description:
        'Налаштуйте нагадування для кожного препарату. Гнучкий графік, повторення та дозування.',
      color: 'blue',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Графік прийому',
      description:
        'Вказуйте час прийому — ранок, день, вечір. Додаток покаже на скільки днів вистачить ваших ліків.',
      color: 'green',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Історія та звіти',
      description:
        'Детальна статистика прийому. Експортуйте звіти для лікаря та слідкуйте за прогресом лікування.',
      color: 'purple',
    },
  ];

  const colorClasses: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
    },
  };

  return (
    <section className="py-20 px-6 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Clock className="w-4 h-4" />
            Розумний графік
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ваш день розписаний
            <br />
            <span className="text-blue-600">по хвилинах</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Більше не потрібно гадати, чи випили ви ліки. Розподіліть прийом на
            ранок, день та вечір. Ми підкажемо, коли запаси будуть
            закінчуватися.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-20" id="features">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Все що потрібно
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Ми створили інструменти, які роблять контроль здоров'я простим та
            зручним
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const colors = colorClasses[feature.color];
              return (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border-2 ${colors.border} ${colors.bg} hover:shadow-lg transition-all`}
                >
                  <div
                    className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} mb-6 border ${colors.border}`}
                  >
                    {feature.icon}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
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
