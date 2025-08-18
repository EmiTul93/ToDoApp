// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import Sentry
import * as Sentry from '@sentry/react';

// Inizializza Sentry
Sentry.init({
  dsn: 'https://7cca9dbf595fefd0006dc0b46de12bce@o4509836565610496.ingest.de.sentry.io/4509836567183440',
  sendDefaultPii: true, // Attenzione: invia anche IP e dati potenzialmente sensibili
});

// Monta l'app con Error Boundary di Sentry
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <p>Si è verificato un errore imprevisto. Ricarica la pagina.</p>
      }
      showDialog // Mostra un popup con il riconoscimento errore in produzione
    >
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
