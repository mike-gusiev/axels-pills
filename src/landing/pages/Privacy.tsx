import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import JoinUs from '../components/JoinUs';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navigation onGetStarted={() => navigate('/register')} />

      {/* Hero Section */}
      <section className="py-10 sm:py-20 px-6 pt-24 sm:pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-6 transition-colors duration-300">
            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('privacy.titlePolicy')}
            <span className="text-blue-600 dark:text-blue-400">
              {t('privacy.titleConfidentiality')}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {t('privacy.lastUpdated')}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue-100 dark:border-blue-800 transition-colors duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {t('privacy.intro.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              {t('privacy.intro.paragraph1')}
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('privacy.intro.paragraph2')}
            </p>
          </div>

          {/* Key Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-2 border-blue-100 dark:border-blue-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('privacy.keyPoints.encryption.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('privacy.keyPoints.encryption.description')}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-100 dark:border-green-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('privacy.keyPoints.access.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('privacy.keyPoints.access.description')}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border-2 border-purple-100 dark:border-purple-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('privacy.keyPoints.gdpr.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('privacy.keyPoints.gdpr.description')}
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 border-2 border-orange-100 dark:border-orange-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('privacy.keyPoints.transparency.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t('privacy.keyPoints.transparency.description')}
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section1.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    {t('privacy.section1.personal')}
                  </strong>{' '}
                  {t('privacy.section1.personalDesc')}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    {t('privacy.section1.medical')}
                  </strong>{' '}
                  {t('privacy.section1.medicalDesc')}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    {t('privacy.section1.technical')}
                  </strong>{' '}
                  {t('privacy.section1.technicalDesc')}
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    {t('privacy.section1.usage')}
                  </strong>{' '}
                  {t('privacy.section1.usageDesc')}
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section2.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section2.item1')}</li>
                  <li>{t('privacy.section2.item2')}</li>
                  <li>{t('privacy.section2.item3')}</li>
                  <li>{t('privacy.section2.item4')}</li>
                  <li>{t('privacy.section2.item5')}</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section3.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section3.intro')}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section3.item1')}</li>
                  <li>{t('privacy.section3.item2')}</li>
                  <li>{t('privacy.section3.item3')}</li>
                  <li>{t('privacy.section3.item4')}</li>
                  <li>{t('privacy.section3.item5')}</li>
                  <li>{t('privacy.section3.item6')}</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section4.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  {
                    t('privacy.section4.intro').split(
                      t('privacy.section4.notSell')
                    )[0]
                  }
                  <strong className="text-gray-900 dark:text-white">
                    {t('privacy.section4.notSell')}
                  </strong>
                  {
                    t('privacy.section4.intro').split(
                      t('privacy.section4.notSell')
                    )[1]
                  }
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section4.item1')}</li>
                  <li>{t('privacy.section4.item2')}</li>
                  <li>{t('privacy.section4.item3')}</li>
                  <li>{t('privacy.section4.item4')}</li>
                </ul>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section5.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section5.intro')}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section5.item1')}</li>
                  <li>{t('privacy.section5.item2')}</li>
                  <li>{t('privacy.section5.item3')}</li>
                  <li>{t('privacy.section5.item4')}</li>
                  <li>{t('privacy.section5.item5')}</li>
                  <li>{t('privacy.section5.item6')}</li>
                  <li>{t('privacy.section5.item7')}</li>
                </ul>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section6.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section6.intro')}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section6.item1')}</li>
                  <li>{t('privacy.section6.item2')}</li>
                  <li>{t('privacy.section6.item3')}</li>
                </ul>
                <p>{t('privacy.section6.outro')}</p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section7.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section7.paragraph1')}</p>
                <p>{t('privacy.section7.paragraph2')}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section7.item1')}</li>
                  <li>{t('privacy.section7.item2')}</li>
                  <li>{t('privacy.section7.item3')}</li>
                </ul>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section8.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section8.content')}</p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section9.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section9.content')}</p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.section10.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.section10.paragraph1')}</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>{t('privacy.section10.item1')}</li>
                  <li>{t('privacy.section10.item2')}</li>
                  <li>{t('privacy.section10.item3')}</li>
                </ul>
                <p>{t('privacy.section10.paragraph2')}</p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-2 border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('privacy.contact.title')}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('privacy.contact.intro')}</p>
                <ul className="space-y-2">
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      {t('privacy.contact.email')}
                    </strong>{' '}
                    privacy@axelspills.com
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      {t('privacy.contact.general')}
                    </strong>{' '}
                    support@axelspills.com
                  </li>
                  <li>
                    <strong className="text-gray-900 dark:text-white">
                      {t('privacy.contact.address')}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JoinUs />

      <Footer />
    </div>
  );
};

export default Privacy;
