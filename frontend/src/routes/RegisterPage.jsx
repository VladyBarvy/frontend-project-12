import { Link } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  return (
    <div className="page">
      <h1>Регистрация</h1>
      <form>
        <input type="text" placeholder="Логин" />
        <input type="password" placeholder="Пароль" />
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
