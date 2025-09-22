import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter';
import { AuthProvider } from './providers/AuthProvider';
import { I18nProvider } from './providers/I18nProvider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);

// Register service worker for PWA offline and installability.
serviceWorkerRegistration.register();
