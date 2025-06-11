import { Link } from 'react-router-dom'
import './NotFoundPage.css'
import { useTranslation } from 'react-i18next'

function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="not-found">
      <h1>{t('not_found_page.no_p')}</h1>
      <p>{t('not_found_page.sorry')}</p>
      <Link to="/" className="home-link">{t('not_found_page.back')}</Link>
    </div>
  );
}

export default NotFoundPage
