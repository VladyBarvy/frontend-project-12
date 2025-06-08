// import { Link } from 'react-router-dom';
// import './RegisterPage.css';

// function RegisterPage() {
//   return (
//     <div className="page">
//       <h1>Регистрация</h1>
//       <form>
//         <input type="text" placeholder="Логин" />
//         <input type="password" placeholder="Пароль" />
//         <button type="submit">Зарегистрироваться</button>
//       </form>
//       <p>
//         Уже есть аккаунт? <Link to="/login">Войти</Link>
//       </p>
//     </div>
//   );
// }

// export default RegisterPage;


import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

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
        setErrors({ username: 'Пользователь уже существует' });
      } else {
        setErrors({ username: 'Ошибка регистрации' });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Регистрация</h1>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="register-form">
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </Form>
        )}
      </Formik>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
