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
      //dispatch(loginSuccess(token));  // важная строка 060625_1
      localStorage.setItem('username', values.username);
      dispatch(loginSuccess({ token, username: values.username }));
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
        Нет аккаунта? <Link to="/signup">Зарегистрируйтесь</Link>
       </p>

    </div>
  );
}

export default LoginPage;
