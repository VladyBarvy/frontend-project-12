import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // // Разрешаем доступ к корневому пути всем, но показываем разный контент
  // if (window.location.pathname === '/') {
  //   return children;
  // }

  // // Для других защищённых путей
  // return isAuthenticated ? children : <Navigate to="/login" replace />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
