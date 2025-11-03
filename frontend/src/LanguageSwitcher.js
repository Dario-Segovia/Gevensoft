import React from 'react';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ compact = false }) => {
  const changeLanguage = (lng) => {
    // Solo guardar en localStorage y recargar la página
    localStorage.setItem('i18nextLng', lng);
    window.location.reload();
  };

  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';

  if (compact) {
    return (
      <div className="language-switcher-compact">
        <button 
          onClick={() => changeLanguage('es')}
          className={currentLanguage === 'es' ? 'active' : ''}
        >
          ES
        </button>
        <button 
          onClick={() => changeLanguage('en')}
          className={currentLanguage === 'en' ? 'active' : ''}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className="language-switcher-container">
      <button 
        onClick={() => changeLanguage('es')}
        className={currentLanguage === 'es' ? 'active' : ''}
      >
        <span>🇪🇸</span> Español
      </button>
      <button 
        onClick={() => changeLanguage('en')}
        className={currentLanguage === 'en' ? 'active' : ''}
      >
        <span>🇬🇧</span> English
      </button>
    </div>
  );
};

export default LanguageSwitcher;