const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">💊</span>
              <span className="text-xl font-bold text-white">Axels Pills</span>
            </div>
            <p className="text-gray-400 mb-4">
              Контроль прийому ліків для всієї родини. Нагадування, графік та
              історія в одному місці.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-400">🇺🇦</span>
              <span className="text-gray-400">Зроблено в Україні</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Швидкі посилання</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Пацієнти
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Препарати
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Історія
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-sm">
              <li>E-mail: support@axelspills.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 Axels Pills. Всі права захищено.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Політика конфіденційності
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Умови використання
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
