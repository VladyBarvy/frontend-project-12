// import { BrowserRouter, Routes, Route } from "react-router-dom";
// //import { PageOne, PageTwo, PageThree } from "../routes/BulidPage.jsx";
// import HomePage from "../routes/HomePage.jsx";
// import LoginPage from "../routes/LoginPage.jsx";
// import NotFoundPage from '../routes/NotFoundPage.jsx';
// import Navigation from './Navigation';
// import "./App.css";

// function App() {

//   return (
//     <>
//       <BrowserRouter>
// 			  <Navigation />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
// 					<Route path="*" element={<NotFoundPage />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;











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

function RootRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return isAuthenticated ? <ChatPage /> : <HomePage />;
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
				<Navigation />
        <Routes>
					<Route 
            path="/" 
            element={
              <ProtectedRoute>
                <RootRoute />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
					<Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
