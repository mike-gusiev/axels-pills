import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const JoinUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-5 sm:py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h3 className="text-4xl font-bold mb-6">{t('about.ctaTitle')}</h3>
        <p className="text-xl mb-8 text-blue-100">{t('about.ctaSubtitle')}</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
        >
          {t('about.ctaButton')}
        </button>
      </div>
    </section>
  );
};

export default JoinUs;
