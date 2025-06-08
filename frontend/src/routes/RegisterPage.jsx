import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import { useTranslation } from 'react-i18next';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
  password: Yup.string()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли не совпадают')
    .required('Обязательное поле'),
});

function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const { username, password } = values;
      const response = await axios.post('/api/v1/signup', { username, password });

      const { token } = response.data;
      dispatch(loginSuccess({ token, username }));
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ username: t('registration_page.user_exist') });
      } else {
        setErrors({ username: t('registration_page.error_regi') });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>{t('registration_page.regi')}</h1>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <div className="form-group">
              <label htmlFor="username">{t('registration_page.name')}</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('registration_page.password')}</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t('registration_page.verif_password')}</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('registration_page.registration_one') : t('registration_page.registration_two')}
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Уже есть аккаунт? <Link to="/login">{t('registration_page.enter')}</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
