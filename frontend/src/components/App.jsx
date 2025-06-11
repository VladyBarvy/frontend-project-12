import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store/store.js'
import LoginPage from '../routes/LoginPage.jsx'
import NotFoundPage from '../routes/NotFoundPage.jsx'
import ChatPage from './ChatPage'
import Navigation from './Navigation'
import RegisterPage from '../routes/RegisterPage.jsx'
import './App.css'
import ProtectedRoute from './ProtectedRoute.jsx'
import { useSelector } from 'react-redux'

function RootRoute() {
  const { isAuthenticated } = useSelector(state => state.auth)
  return isAuthenticated ? <ChatPage /> : <LoginPage />
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/chat"
            element={(
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </BrowserRouter>
    </Provider>

  )
}

export default App
