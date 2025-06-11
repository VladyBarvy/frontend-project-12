import { useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutButton() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <button onClick={handleLogout}>
      Выйти
    </button>
  )
}

export default LogoutButton
