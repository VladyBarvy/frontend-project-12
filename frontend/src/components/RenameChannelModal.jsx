// import Modal from 'react-modal';
// import * as Yup from 'yup';
// import { useSelector } from 'react-redux';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import axios from 'axios';





// const RenameChannelModal = ({ channelId, initialName, onClose }) => {
// 	const token = useSelector((state) => state.auth.token);

//   // Безопасное извлечение имён каналов
//   const existingNames = useSelector((state) =>
//     state.channels?.channels?.map((ch) => ch.name) || []
//   );

//   const RenameSchema = Yup.object().shape({
//     name: Yup.string()
//       .min(3, 'Название должно быть не короче 3 символов')
//       .max(20, 'Название должно быть не длиннее 20 символов')
//       .notOneOf(existingNames.filter((name) => name !== initialName), 'Канал с таким именем уже существует')
//       .required('Обязательное поле'),
//   });

// 	const handleRename = async (values, { setSubmitting }) => {
// 		try {
// 			await axios.patch(`/api/v1/channels/${channelId}`, { name: values.name }, {
// 				headers: { Authorization: `Bearer ${token}` },
// 			});
// 			onClose();
// 		} catch (err) {
// 			console.error('Ошибка при переименовании:', err);
// 		} finally {
// 			setSubmitting(false);
// 		}
// 	};

// 	return (
// 		<Formik
// 			initialValues={{ name: initialName }}
// 			validationSchema={RenameSchema}
// 			onSubmit={handleRename}
// 		>
// 			{({ isSubmitting }) => (
// 				<Form>
// 					<Field name="name" />
// 					<ErrorMessage name="name" component="div" />
// 					<button type="submit" disabled={isSubmitting}>
// 						Переименовать
// 					</button>
// 				</Form>
// 			)}
// 		</Formik>
// 	);
// };

// export default RenameChannelModal;

















import Modal from 'react-modal';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';

const RenameChannelModal = ({ channelId, initialName, onClose }) => {
  const token = useSelector((state) => state.auth.token);

  // Безопасное извлечение имён каналов
  const existingNames = useSelector((state) =>
    state.channels?.channels?.map((ch) => ch.name) || []
  );

  const RenameSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Название должно быть не короче 3 символов')
      .max(20, 'Название должно быть не длиннее 20 символов')
      .notOneOf(existingNames.filter((name) => name !== initialName), 'Канал с таким именем уже существует')
      .required('Обязательное поле'),
  });

  const handleRename = async (values, { setSubmitting }) => {
    try {
      await axios.patch(`/api/v1/channels/${channelId}`, { name: values.name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onClose();
    } catch (err) {
      console.error('Ошибка при переименовании:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onRequestClose={onClose}>
      <h2>Переименовать канал</h2>
      <Formik
        initialValues={{ name: initialName }}
        validationSchema={RenameSchema}
        onSubmit={handleRename}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="name">Название канала:</label>
            <Field id="name" name="name" autoFocus />
            <ErrorMessage name="name" component="div" className="error" />
            <div>
              <button type="submit" disabled={isSubmitting}>
                Переименовать
              </button>
              <button type="button" onClick={onClose}>
                Отмена
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;

