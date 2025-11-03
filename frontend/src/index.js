import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// ELIMINA esta línea: import './i18n.js'; 
import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import Header from './components/Header';
import { CartProvider } from "./components/CartContext";
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Header />
        <App />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);

reportWebVitals();