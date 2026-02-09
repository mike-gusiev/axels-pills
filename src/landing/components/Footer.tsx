import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t('footer.contacts')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>E-mail: support@axelspills.com</li>
            </ul>
          </div>

          {/* Brand */}
          <div className="md:col-span-2 md:col-start-3">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">💊</span>
              <span className="text-xl font-bold text-white">Axels Pills</span>
            </div>
            <p className="text-gray-400 mb-4">{t('footer.description')}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-400">🇺🇦</span>
              <span className="text-gray-400">{t('footer.madeIn')}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
