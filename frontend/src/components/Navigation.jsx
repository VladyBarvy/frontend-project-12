import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import './Navigation.css'

function Navigation() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/" className="nav-link">Hexlet Chat</Link>
        </li>
        {!isAuthenticated && (
          <>
            <li>
              <Link to="/login" className="nav-link">Вход</Link>
            </li>
            <li>
              <Link to="/signup" className="nav-link">Регистрация</Link>
            </li>
          </>
        )}
        {isAuthenticated && (
          <li>
            <button onClick={handleLogout} className="nav-link logout-button">Выйти</button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export default Navigation
