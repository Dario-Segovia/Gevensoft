import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Nosotros.css";
import logoLocal from '../../assets/logo.jpg'; 

function Nosotros() {
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/empresa");
        const data = await res.json();
        setEmpresa(data[0]);
      } catch (err) {
        setError(currentLanguage === 'en' ? 'Error loading information' : 'Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [currentLanguage]);

  // Función para construir la URL del logo
  const getLogoUrl = () => {
    if (!empresa?.logo) return logoLocal;
    
    if (empresa.logo.startsWith('http')) {
      return empresa.logo;
    }
    
    return `http://localhost:3000${empresa.logo.startsWith('/') ? '' : '/'}${empresa.logo}`;
  };

  // Función para obtener el nombre de la empresa según el idioma
  const getCompanyName = () => {
    if (currentLanguage === 'en' && empresa?.ingles) {
      return empresa.ingles;
    }
    return empresa?.nombre || (currentLanguage === 'en' ? 'Our Company' : 'Nuestra Empresa');
  };

  // Textos según idioma
  const texts = {
    sobre: currentLanguage === 'en' ? 'About' : 'Sobre',
    quienes_somos: currentLanguage === 'en' ? 'Who We Are' : 'Quiénes Somos',
    fundada: currentLanguage === 'en' ? 'Founded in' : 'Fundada en',
    nuestros_valores: currentLanguage === 'en' ? 'Our Values' : 'Nuestros Valores',
    compromiso: currentLanguage === 'en' ? 'Commitment to excellence' : 'Compromiso con la excelencia',
    innovacion: currentLanguage === 'en' ? 'Constant innovation' : 'Innovación constante',
    calidad: currentLanguage === 'en' ? 'Uncompromising quality' : 'Calidad sin compromisos',
    transparencia: currentLanguage === 'en' ? 'Total transparency' : 'Transparencia total',
    ubicacion: currentLanguage === 'en' ? 'Location' : 'Ubicación',
    texto_footer: currentLanguage === 'en' ? 'Thank you for trusting us' : 'Gracias por confiar en nosotros',
    cargando: currentLanguage === 'en' ? 'Loading...' : 'Cargando...'
  };

  if (loading) return <div className="loading">{texts.cargando}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="nosotros-container">
      <div className="hero">
        <h1>{texts.sobre} {getCompanyName()}</h1>
        <img 
          src={getLogoUrl()}
          alt="Logo del restaurante" 
          className="header-logo"
        />
      </div>

      <section className="descripcion">
        <h2>{texts.quienes_somos}</h2>
        <p>{empresa?.razon_social}</p>
        <p>{texts.fundada} {new Date(empresa?.fecha_alta).getFullYear()}</p>
      </section>

      <section className="valores">
        <h2>{texts.nuestros_valores}</h2>
        <ul>
          <li>{texts.compromiso}</li>
          <li>{texts.innovacion}</li>
          <li>{texts.calidad}</li>
          <li>{texts.transparencia}</li>
        </ul>
      </section>

      <section className="ubicacion">
        <h2>{texts.ubicacion}</h2>
        <p>
          {empresa?.direccion}, {empresa?.codigo_postal}
        </p>
        <p>
          {empresa?.poblacion}, {empresa?.provincia}, {empresa?.pais}
        </p>
      </section>

      <footer className="footer-nosotros">
        {texts.texto_footer}
      </footer>
    </div>
  );
}

export default Nosotros;