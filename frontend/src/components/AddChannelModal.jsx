import Modal from 'react-modal'; // или любой другой пакет
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';

const AddChannelModal = ({ isOpen, onRequestClose, onAddChannel, channels }) => {
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .notOneOf(channels.map(c => c.name), 'Такое имя уже существует')
      .required('Обязательное поле'),
  });

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Добавить канал">
      <h2>Добавить канал</h2>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onAddChannel(values.name);
          setSubmitting(false);
          onRequestClose();
        }}
      >
        {({ errors, touched }) => (
          // <Form>
          //   <Field name="name" placeholder="Имя канала" autoFocus />
          //   {errors.name && touched.name && <div className="error">{errors.name}</div>}

          //   <button type="submit">Добавить</button>
          //   <button type="button" onClick={onRequestClose}>Отмена</button>
          // </Form>

          <Form>
            <label htmlFor="channelName">Имя канала</label>
            <Field id="channelName" name="name" placeholder="Имя канала" autoFocus />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}

            <button type="submit">Отправить</button>
            <button type="button" onClick={onRequestClose}>Отменить</button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
