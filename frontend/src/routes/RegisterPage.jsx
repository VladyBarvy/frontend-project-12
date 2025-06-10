import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';
import { useTranslation } from 'react-i18next';



function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const RegisterSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('registration_page.symbol_3_20'))
      .max(20, t('registration_page.symbol_3_20'))
      .required(t('registration_page.must_have_form')),
    password: Yup.string()
      .min(6, t('registration_page.symbol_six'))
      .required(t('registration_page.must_have_form')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('registration_page.password_wrong'))
      .required(t('registration_page.must_have_form')),
  });


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
        {({ errors, touched, isSubmitting }) => (
          <Form className="register-form">
            <div className="form-group">
              
              <Field id="username" type="text" name="username" placeholder={t('registration_page.symbol_3_20')} autoComplete="username" required />
              <label htmlFor="username">{t('registration_page.name')}</label>
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
             
              <Field id="password" type="password" name="password" placeholder={t('registration_page.symbol_six')} autoComplete="new-password" required />
               <label htmlFor="password">{t('registration_page.password')}</label>
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              
              <Field id="confirmPassword" type="password" name="confirmPassword" placeholder={t('registration_page.verif_password')} autoComplete="new-password" required />
              <label htmlFor="confirmPassword">{t('registration_page.verif_password')}</label>
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
