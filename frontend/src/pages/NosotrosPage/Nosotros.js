import { useState, useEffect, useCallback } from "react";
import "./Nosotros.css";
import logoLocal from '../../assets/logo.jpg'; 

function Nosotros() {
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoError, setLogoError] = useState(false);

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

  // Función MEJORADA para construir la URL del logo
  const getLogoUrl = useCallback(() => {
    if (logoError) {
      return logoLocal;
    }

    if (!empresa?.logo) {
      return logoLocal;
    }
    
    if (empresa.logo.startsWith('http')) {
      return empresa.logo;
    }
    
    return `http://localhost:3000${empresa.logo.startsWith('/') ? '' : '/'}${empresa.logo}`;
  }, [empresa?.logo, logoError]);

  // Handler para errores del logo
  const handleLogoError = useCallback((e) => {
    console.warn('Error cargando logo en Nosotros:', e.target.src);
    
    if (e.target.src !== logoLocal) {
      setLogoError(true);
      e.target.src = logoLocal;
    } else {
      e.target.onerror = null;
      console.error('No se pudo cargar el logo local en Nosotros');
    }
  }, [logoLocal]);

  // Función para obtener el nombre de la empresa según el idioma
  const getCompanyName = () => {
    if (currentLanguage === 'en' && empresa?.ingles) {
      return empresa.ingles;
    }
    return empresa?.nombre || (currentLanguage === 'en' ? 'Our Company' : 'Nuestra Empresa');
  };

  // Función para obtener el texto del footer según el idioma
  const getFooterText = () => {
    if (currentLanguage === 'en' && empresa?.texto_footer_ingles) {
      return empresa.texto_footer_ingles;
    }
    return empresa?.texto_footer || (currentLanguage === 'en' ? 'Thank you for trusting us' : 'Gracias por confiar en nosotros');
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
    cargando: currentLanguage === 'en' ? 'Loading...' : 'Cargando...'
  };

  if (loading) return <div className="loading">{texts.cargando}</div>;
  if (error) return <div className="error">{error}</div>;

  const logoUrl = getLogoUrl();

  return (
    <div className="nosotros-container">
      <div className="hero">
        <h1>{texts.sobre} {getCompanyName()}</h1>
        <img 
          src={logoUrl}
          alt="Logo del restaurante" 
          className="header-logo"
          onError={handleLogoError}
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
        {getFooterText()}
      </footer>
    </div>
  );
}

export default Nosotros;