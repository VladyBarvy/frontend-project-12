// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import ru from './locales/ru/translation.json';


// i18n
//   .use(initReactI18next)
//   .init({
//     resources: {
//       ru: { translation: ru },
//     },
//     lng: 'ru', // дефолтная локаль
//     fallbackLng: 'ru',
//     interpolation: {
//       escapeValue: false,
//     },
//   });

//   console.log('i18n initialized:', i18n.isInitialized);
// export default i18n;



import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru/translation.json';

const initPromise = i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
    },
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export { initPromise };
export default i18n;

