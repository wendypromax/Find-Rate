// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { FavoritosProvider } from './context/FavoritosContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FavoritosProvider>
      <App />
    </FavoritosProvider>
  </React.StrictMode>
);
