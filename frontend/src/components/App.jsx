import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store/store.js';
import HomePage from "../routes/HomePage.jsx";
import LoginPage from "../routes/LoginPage.jsx";
import NotFoundPage from '../routes/NotFoundPage.jsx';
import ChatPage from './ChatPage';
import Navigation from './Navigation';
import RegisterPage from '../routes/RegisterPage.jsx';
import "./App.css";
import ProtectedRoute from './ProtectedRoute.jsx';
import { useSelector } from 'react-redux';
import { Provider, ErrorBoundary } from '@rollbar/react'; // Provider imports 'rollbar'

const rollbarConfig = {
  accessToken: '04b172f02a6548e79408a65929ffafcf',
  environment: 'testenv',
};

function TestError() {
  const a = null;
  return a.hello();
}

function RootRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? <ChatPage /> : <HomePage />;
}

function App() {
  return (
    <Provider store={store}>
      <Provider config={rollbarConfig}>
        <ErrorBoundary>
          <TestError />
        </ErrorBoundary>
      </Provider>

      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Routes>



      </BrowserRouter>
    </Provider>

  );
}

export default App;
