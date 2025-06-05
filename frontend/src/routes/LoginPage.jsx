// import { Link } from 'react-router-dom';

// function LoginPage() {
//   return (
//     <div className="page">
//       <h1>Страница входа</h1>
//       <form>
//         <input type="text" placeholder="Логин" />
//         <input type="password" placeholder="Пароль" />
//         <button type="submit">Войти</button>
//       </form>
//       <p>
//         Нет аккаунта? <Link to="/">Вернуться на главную</Link>
//       </p>
//     </div>
//   );
// }

// export default LoginPage;


























// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { Link } from 'react-router-dom';
// import './LoginPage.css'; // Стили (опционально)

// // Схема валидации
// const LoginSchema = Yup.object().shape({
//   username: Yup.string()
//     .min(3, 'Слишком короткий логин!')
//     .max(20, 'Слишком длинный логин!')
//     .required('Обязательное поле'),
//   password: Yup.string()
//     .min(6, 'Пароль должен быть не менее 6 символов')
//     .required('Обязательное поле'),
// });

// function LoginPage() {
//   const initialValues = {
//     username: '',
//     password: '',
//   };

//   const handleSubmit = (values) => {
//     // Здесь будет логика отправки формы (пока просто выводим в консоль)
//     console.log('Данные формы:', values);
//   };

//   return (
//     <div className="login-page">
//       <h1>Авторизация</h1>
      
//       <Formik
//         initialValues={initialValues}
//         validationSchema={LoginSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ isSubmitting }) => (
//           <Form className="login-form">
//             <div className="form-group">
//               <label htmlFor="username">Логин:</label>
//               <Field 
//                 type="text" 
//                 name="username" 
//                 id="username"
//                 placeholder="Введите ваш логин"
//               />
//               <ErrorMessage name="username" component="div" className="error-message" />
//             </div>

//             <div className="form-group">
//               <label htmlFor="password">Пароль:</label>
//               <Field 
//                 type="password" 
//                 name="password" 
//                 id="password"
//                 placeholder="Введите пароль"
//               />
//               <ErrorMessage name="password" component="div" className="error-message" />
//             </div>

//             <button 
//               type="submit" 
//               disabled={isSubmitting}
//               className="submit-btn"
//             >
//               Войти
//             </button>
//           </Form>
//         )}
//       </Formik>

//       <p className="register-link">
//         Нет аккаунта? <Link to="/">Зарегистрируйтесь</Link>
//       </p>
//     </div>
//   );
// }

// export default LoginPage;














import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { login } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';

// Схема валидации
const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Слишком короткий логин!')
    .max(20, 'Слишком длинный логин!')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(4, 'Пароль должен быть не менее 6 символов')
    .required('Обязательное поле'),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (values) => {
    try {
      dispatch(loginStart());
      const { token } = await login(values);
      dispatch(loginSuccess(token));
      navigate('/');
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div className="login-page">
      <h1>Авторизация</h1>
      {error && <div className="error">{error}</div>}
      
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="login-form">
            <div className="form-group">
              <label htmlFor="username">Логин</label>
              <Field 
								type="text"
								name="username"
								id="username"
								placeholder="Введите ваш логин"
							/>
              {errors.username && touched.username && (
                <div className="error">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Field 
								name="password"
								type="password"
								id="password"
								placeholder="Введите пароль"
							/>
              {errors.password && touched.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </Form>
        )}
      </Formik>

			<p className="register-link">
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
       </p>

    </div>
  );
}

export default LoginPage;
