import Modal from 'react-modal';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

const RenameChannelModal = ({ channelId, initialName, onClose }) => {
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation();
  // Безопасное извлечение имён каналов
  const existingNames = useSelector((state) =>
    state.channels?.channels?.map((ch) => ch.name) || []
  );

  const filterProfanity = (text) => {
    if (!leoProfanity.list().length) {
      leoProfanity.loadDictionary('ru');
      leoProfanity.add(leoProfanity.getDictionary('en'));
    }
  
    const filtered = leoProfanity.clean(text);
    if (filtered !== text) {
      toast.warn(t('chat.profanity_filtered'));
    }
    return filtered;
  };

  const RenameSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('rename_channel_page.symb_3'))
      .max(20, t('rename_channel_page.symb_20'))
      .notOneOf(existingNames.filter((name) => name !== initialName), t('rename_channel_page.channel_name_exist'))
      .required(t('rename_channel_page.must_have_form')),
  });

  // const handleRename = async (values, { setSubmitting }) => {
  //   try {
  //     await axios.patch(`/api/v1/channels/${channelId}`, { name: values.name }, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     toast.success(t('chat.channel_renamed'));
  //     onClose();
  //   } catch (err) {
  //     console.error('Ошибка при переименовании:', err);
  //     toast.error(t('chat.error_rename_channel'));
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleRename = async (values, { setSubmitting }) => {
    try {
      const cleanName = filterProfanity(values.name);
  
      await axios.patch(`/api/v1/channels/${channelId}`, { name: cleanName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success(t('chat.channel_renamed'));
      onClose();
    } catch (err) {
      console.error('Ошибка при переименовании:', err);
      toast.error(t('chat.error_rename_channel'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onRequestClose={onClose}>
      <h2>{t('rename_channel_page.rename_channel_go')}</h2>
      <Formik
        initialValues={{ name: initialName }}
        validationSchema={RenameSchema}
        onSubmit={handleRename}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="name">{t('rename_channel_page.name_of_channel')}</label>
            <Field id="name" name="name" autoFocus />
            <ErrorMessage name="name" component="div" className="error" />
            <div>
              <button type="submit" disabled={isSubmitting}>
              {t('rename_channel_page.rename_go_one')}
              </button>
              <button type="button" onClick={onClose}>
              {t('rename_channel_page.cancel_go')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;

