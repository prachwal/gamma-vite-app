
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initializeI18n } from './services/i18n';
import '@ant-design/v5-patch-for-react-19';

(async () => {
  await initializeI18n();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();
