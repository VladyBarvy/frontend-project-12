import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { login } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './LoginPage.css';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      <h1>{t('login_page.autorisation')}</h1>
      {error && <div className="error">{error}</div>}
      
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="login-form">
            <div className="form-group">
              
              <Field 
								type="text"
								name="username"
								id="username"
								placeholder={t('login_page.login_name')}
							/>
              <label htmlFor="username">{t('login_page.login_name')}</label>
              {errors.username && touched.username && (
                <div className="error">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
             
              <Field 
								name="password"
								type="password"
								id="password"
								placeholder={t('login_page.password')}
							/>
               <label htmlFor="password">{t('login_page.password')}</label>
              {errors.password && touched.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? t('login_page.enter_go') : t('login_page.enter_lets_go')}
            </button>
          </Form>
        )}
      </Formik>

			<p className="register-link">
        Нет аккаунта? <Link to="/signup">{t('login_page.sign_up_please')}</Link>
       </p>

    </div>
  );
}

export default LoginPage;
