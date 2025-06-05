import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="page">
      <h1>Home Page Hexlet Chat</h1>
      <p>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
}

export default HomePage;
