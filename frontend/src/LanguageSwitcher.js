import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div style={{ margin: '10px 0' }}>
      <button onClick={() => i18n.changeLanguage('es')}>🇪🇸 Español</button>
      <button onClick={() => i18n.changeLanguage('en')}>🇬🇧 English</button>
    </div>
  );
};

export default LanguageSwitcher;
