import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="language-switcher-container">
      <button onClick={() => i18n.changeLanguage('es')}>
        <span>🇪🇸</span> Español
      </button>
      <button onClick={() => i18n.changeLanguage('en')}>
        <span>🇬🇧</span> English
      </button>
    </div>
  );
};

export default LanguageSwitcher;