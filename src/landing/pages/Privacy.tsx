import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation onGetStarted={() => navigate('/register')} />

      {/* Hero Section */}
      <section className="py-10 sm:py-20 px-6 pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Політика <span className="text-blue-600">конфіденційності</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Останнє оновлення: 6 лютого 2026 року
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Вступ</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ласкаво просимо до Axels Pills! Ми цінуємо вашу довіру і серйозно
              ставимося до захисту вашої особистої інформації. Ця політика
              конфіденційності описує, яку інформацію ми збираємо, як ми її
              використовуємо та захищаємо.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Використовуючи наш сервіс, ви погоджуєтесь з умовами цієї політики
              конфіденційності. Якщо у вас є питання, будь ласка, зв'яжіться з
              нами.
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Шифрування даних
              </h3>
              <p className="text-gray-600">
                Всі ваші медичні дані зберігаються в зашифрованому вигляді
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Контроль доступу
              </h3>
              <p className="text-gray-600">
                Тільки ви маєте доступ до своїх медичних записів
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Відповідність GDPR
              </h3>
              <p className="text-gray-600">
                Ми дотримуємось усіх вимог європейського законодавства
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Прозорість
              </h3>
              <p className="text-gray-600">
                Ви завжди знаєте, які дані ми збираємо і для чого
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Яку інформацію ми збираємо
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Особисті дані:</strong>{' '}
                  ім'я, електронна пошта, телефон (за бажанням)
                </p>
                <p>
                  <strong className="text-gray-900">Медичні дані:</strong>{' '}
                  інформація про медикаменти, графік прийому, нагадування,
                  дозування
                </p>
                <p>
                  <strong className="text-gray-900">Технічні дані:</strong>{' '}
                  IP-адреса, тип пристрою, версія браузера для покращення роботи
                  сервісу
                </p>
                <p>
                  <strong className="text-gray-900">
                    Дані про використання:
                  </strong>{' '}
                  як ви використовуєте наш додаток для покращення
                  функціональності
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Як ми використовуємо вашу інформацію
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    Надання основної функціональності додатка (нагадування,
                    графік)
                  </li>
                  <li>Покращення якості сервісу та користувацького досвіду</li>
                  <li>Надсилання важливих повідомлень про сервіс</li>
                  <li>Забезпечення безпеки та запобігання шахрайству</li>
                  <li>Відповідність законодавчим вимогам</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Захист ваших даних
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Ми використовуємо передові технології безпеки для захисту
                  ваших даних:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>SSL/TLS шифрування для передачі даних</li>
                  <li>AES-256 шифрування для зберігання даних</li>
                  <li>Регулярні аудити безпеки</li>
                  <li>Двофакторна автентифікація (опціонально)</li>
                  <li>Резервне копіювання даних</li>
                  <li>Обмежений доступ співробітників до даних</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Обмін інформацією з третіми сторонами
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Ми <strong className="text-gray-900">НЕ продаємо</strong> ваші
                  особисті дані третім особам. Ми можемо ділитися інформацією
                  тільки в таких випадках:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>За вашою явною згодою</li>
                  <li>
                    З сервіс-провайдерами, які допомагають нам надавати послуги
                    (хмарне сховище, аналітика)
                  </li>
                  <li>Якщо це вимагається законом або судовим рішенням</li>
                  <li>Для захисту прав та безпеки користувачів</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Ваші права
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Ви маєте право:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong className="text-gray-900">Доступ:</strong>{' '}
                    переглядати всі дані, які ми зберігаємо про вас
                  </li>
                  <li>
                    <strong className="text-gray-900">Виправлення:</strong>{' '}
                    виправляти неточні дані
                  </li>
                  <li>
                    <strong className="text-gray-900">Видалення:</strong>{' '}
                    запитати видалення ваших даних
                  </li>
                  <li>
                    <strong className="text-gray-900">Експорт:</strong> отримати
                    копію ваших даних у зручному форматі
                  </li>
                  <li>
                    <strong className="text-gray-900">
                      Відкликання згоди:
                    </strong>{' '}
                    в будь-який момент відкликати згоду на обробку даних
                  </li>
                  <li>
                    <strong className="text-gray-900">Скарга:</strong> подати
                    скаргу до наглядового органу
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Cookies та технології відстеження
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Ми використовуємо cookies для:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Збереження налаштувань входу</li>
                  <li>Аналізу використання сервісу</li>
                  <li>Покращення функціональності</li>
                </ul>
                <p>
                  Ви можете контролювати використання cookies через налаштування
                  браузера.
                </p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Зберігання даних
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Ми зберігаємо ваші дані доти, доки ваш акаунт активний або
                  доки це необхідно для надання послуг. Після видалення акаунта
                  ваші дані видаляються протягом 30 днів, окрім випадків, коли
                  ми зобов'язані зберігати їх за законом.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Зміни до політики конфіденційності
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Ми можемо оновлювати цю політику час від часу. Про суттєві
                  зміни ми повідомимо вас через додаток або електронну пошту.
                  Рекомендуємо періодично переглядати цю сторінку.
                </p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Контактна інформація
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Якщо у вас є питання щодо цієї політики конфіденційності або
                  обробки ваших даних, зв'яжіться з нами:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong className="text-gray-900">Email:</strong>{' '}
                    support@axelspills.com
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ваша конфіденційність — наш пріоритет
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Приєднуйтесь до тисяч користувачів, які довіряють нам
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            Зареєструватися
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
