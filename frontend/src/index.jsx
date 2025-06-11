import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import i18n, { initPromise } from './i18n.js'
import './index.css'
import App from './components/App.jsx'

initPromise.then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </StrictMode>
  );
});

