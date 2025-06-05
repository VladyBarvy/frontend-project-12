import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-link">Главная</Link>
        </li>
        <li>
          <Link to="/login" className="nav-link">Вход</Link>
        </li>
        <li>
          <Link to="/register" className="nav-link">Регистрация</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
