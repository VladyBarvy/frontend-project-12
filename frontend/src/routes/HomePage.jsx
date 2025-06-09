import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomePage() {
  
  const { t } = useTranslation();



  return (
    <div className="page">
      <h1>{t('home.header')}</h1>
      <p>
        {t('home.loginLink')} <Link to="/login">{t('login.title')}</Link>
      </p>
    </div>
  );
}

export default HomePage;
