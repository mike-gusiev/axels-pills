import { Target, Users, Award, Heart, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { value: '5+', label: 'Років на ринку' },
    { value: '10K+', label: 'Активних користувачів' },
    { value: '1M+', label: 'Нагадувань надіслано' },
    { value: '99%', label: 'Задоволених клієнтів' },
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Наша місія',
      description:
        "Зробити управління медикаментами простим та доступним для кожного. Ми віримо, що здоров'я не повинно бути складним.",
      color: 'blue',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Команда',
      description:
        "Ми — команда медичних фахівців, розробників та дизайнерів, об'єднаних спільною метою покращити якість життя людей.",
      color: 'green',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Досвід',
      description:
        'Більше 5 років ми допомагаємо людям не забувати про ліки, відстежувати прогрес лікування та спілкуватися з лікарями.',
      color: 'purple',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Цінності',
      description:
        'Конфіденційність, надійність та турбота про користувача — основа нашого підходу до розробки продукту.',
      color: 'red',
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
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation onGetStarted={() => navigate('/register')} />

      {/* Hero Section */}
      <section className="py-5 sm:py-20 px-6 pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Про <span className="text-blue-600">Axels Pills</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Ми створили Axels Pills, щоб зробити контроль за здоров'ям простішим
            та доступнішим для кожного. Наша платформа допомагає тисячам людей
            щодня дотримуватися графіку прийому медикаментів та покращувати
            якість життя.
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
                className="bg-white rounded-2xl p-8 shadow-lg text-center border-2 border-blue-100"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Що робить нас особливими
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const colors = colorClasses[value.color];
              return (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border-2 ${colors.border} ${colors.bg} hover:shadow-lg transition-all`}
                >
                  <div
                    className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} mb-6 border ${colors.border}`}
                  >
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5 sm:py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Наша історія
          </h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Axels Pills народився в епіцентрі дедлайнів та нескінченних
              списків справ. Ми помітили, що в сучасному світі людина швидше
              забуде випити необхідний вітамін чи важливий препарат, ніж
              перевірити сповіщення в соцмережах.
            </p>
            <p>
              Ми пройшли шлях від особистої замітки в телефоні до
              інтелектуальної системи, яка бере рутину на себе. Axels Pills - це
              ваш «зовнішній мозок» для здоров’я. Ми тут, щоб ви могли
              фокусуватися на житті, а не на графіках прийому.
            </p>
            <p>
              Сьогодні Axels Pills - це не просто додаток, а партнер у вашому
              здоров'ї. Ми продовжуємо вдосконалювати наші інструменти, додавати
              нові функції та робити життя наших користувачів легшим щодня.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 sm:py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Приєднуйтесь до тисяч задоволених користувачів
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Почніть контролювати своє здоров'я вже сьогодні
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            Зареєструватись
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Pill className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">Axels Pills</span>
          </div>
          <p className="text-gray-400">
            © 2026 Axels Pills. Всі права захищені.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
