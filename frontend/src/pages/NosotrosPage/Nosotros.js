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
        if (!res.ok) {
          throw new Error('Error en la respuesta de la API');
        }
        const data = await res.json();
        // Verificar si hay datos válidos
        if (data && data.length > 0 && data[0]) {
          setEmpresa(data[0]);
        } else {
          setEmpresa({}); // Objeto vacío si no hay datos
        }
      } catch (err) {
        setError(currentLanguage === 'en' ? 'Error loading information' : 'Error al cargar la información');
        setEmpresa({}); // Objeto vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [currentLanguage]);

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

  // Función para obtener la razón social
  const getRazonSocial = () => {
    return empresa?.razon_social || (currentLanguage === 'en' 
      ? 'We are a company committed to excellence and customer satisfaction' 
      : 'Somos una empresa comprometida con la excelencia y la satisfacción del cliente');
  };

  // Función para obtener el año de fundación
  const getFundacionYear = () => {
    if (empresa?.fecha_alta) {
      return new Date(empresa.fecha_alta).getFullYear();
    }
    return currentLanguage === 'en' ? '2023' : '2023';
  };

  // Función para obtener la dirección completa
  const getDireccionCompleta = () => {
    if (!empresa?.direccion) {
      return currentLanguage === 'en' ? 'Address not available' : 'Dirección no disponible';
    }
    
    const parts = [
      empresa.direccion,
      empresa.codigo_postal,
      empresa.poblacion,
      empresa.provincia,
      empresa.pais
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  // Función MEJORADA para construir la URL del logo
  const getLogoUrl = useCallback(() => {
    if (logoError || !empresa?.logo) {
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
    cargando: currentLanguage === 'en' ? 'Loading...' : 'Cargando...',
    error_info: currentLanguage === 'en' ? 'Error loading information' : 'Error al cargar la información',
    informacion_no_disponible: currentLanguage === 'en' ? 'Information not available' : 'Información no disponible'
  };

  if (loading) return <div className="loading">{texts.cargando}</div>;
  if (error && !empresa) return <div className="error">{texts.error_info}</div>;

  const logoUrl = getLogoUrl();

  return (
    <div className="nosotros-container">
      <div className="hero">
        <h1>{texts.sobre} {getCompanyName()}</h1>
        <img 
          src={logoUrl}
          alt={currentLanguage === 'en' ? 'Company logo' : 'Logo de la empresa'} 
          className="header-logo"
          onError={handleLogoError}
        />
      </div>

      <section className="descripcion">
        <h2>{texts.quienes_somos}</h2>
        <p>{getRazonSocial()}</p>
        <p>{texts.fundada} {getFundacionYear()}</p>
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
        <p>{getDireccionCompleta()}</p>
      </section>

      {empresa?.telefono && (
        <section className="contacto">
          <h2>{currentLanguage === 'en' ? 'Contact' : 'Contacto'}</h2>
          <p>{empresa.telefono}</p>
          {empresa.email && <p>{empresa.email}</p>}
        </section>
      )}

      <footer className="footer-nosotros">
        {getFooterText()}
        {error && (
          <div className="warning-message">
            ⚠️ {currentLanguage === 'en' ? 'Some information may not be up to date' : 'Alguna información podría no estar actualizada'}
          </div>
        )}
      </footer>
    </div>
  );
}

export default Nosotros;