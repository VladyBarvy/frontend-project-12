import { Link } from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404 — Страница не найдена!</h1>
      <p>Извините, такой страницы не существует.</p>
      <Link to="/" className="home-link">Вернуться на главную</Link>
    </div>
  );
}

export default NotFoundPage;
