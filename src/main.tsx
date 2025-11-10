import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Einstieg in die React-Welt: Wir montieren das App-Root und könnten hier
// globale Provider platzieren.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
