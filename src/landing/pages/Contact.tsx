import {
  ArrowLeft,
  Pill,
  Mail,
  MessageSquare,
  MapPin,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Contact = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    alert(
      "Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом."
    );
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </button>
          <div className="flex items-center gap-2">
            <Pill className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Axels Pills</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Увійти
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Зв'яжіться з <span className="text-blue-600">нами</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Маєте питання чи пропозиції? Ми завжди раді почути від вас. Наша
            команда відповість якомога швидше.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Контактна інформація
              </h2>
              <p className="text-gray-600 mb-8">
                Оберіть зручний для вас спосіб зв'язку. Ми працюємо з понеділка
                по п'ятницю з 9:00 до 18:00.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Відправте нам лист і ми відповімо протягом 24 годин
                    </p>
                    <a
                      href="mailto:support@axelspills.com"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      support@axelspills.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Телефон
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Зателефонуйте нам у робочий час
                    </p>
                    <a
                      href="tel:+380123456789"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      +380 (12) 345-67-89
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Адреса
                    </h3>
                    <p className="text-gray-600">
                      вул. Хрещатик, 1<br />
                      Київ, 01001
                      <br />
                      Україна
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-100 hover:shadow-xl transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Соціальні мережі
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Слідкуйте за нами в соціальних мережах
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Facebook
                      </a>
                      <span className="text-gray-300">|</span>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Instagram
                      </a>
                      <span className="text-gray-300">|</span>
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Надішліть нам повідомлення
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ім'я
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Ваше ім'я"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Тема
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Тема вашого звернення"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Повідомлення
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Опишіть ваше питання або пропозицію..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Відправити повідомлення
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Часті питання
          </h2>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Як швидко ви відповідаєте на звернення?
              </h3>
              <p className="text-gray-600">
                Ми намагаємося відповідати на всі звернення протягом 24 годин у
                робочі дні. Термінові питання можна вирішити по телефону.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Чи можу я отримати консультацію по телефону?
              </h3>
              <p className="text-gray-600">
                Так, ви можете зателефонувати нам у робочі години (ПН-ПТ,
                9:00-18:00) за номером +380 (12) 345-67-89.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Де знаходиться ваш офіс?
              </h3>
              <p className="text-gray-600">
                Наш офіс розташований в центрі Києва за адресою: вул. Хрещатик,
                1, Київ, 01001, Україна.
              </p>
            </div>
          </div>
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

export default Contact;
