import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import './Contacto.css';

function Contacto() {
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/empresa');
        if (!response.ok) {
          throw new Error(currentLanguage === 'en' ? 'Error loading information' : 'Error al cargar la información');
        }
        const data = await response.json();
        // Verificar si hay datos y si el primer elemento existe
        setEmpresaData(data && data.length > 0 ? data[0] : {});
      } catch (err) {
        setError(err.message);
        // Establecer datos vacíos en caso de error
        setEmpresaData({});
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLanguage]);

  // Función para obtener el nombre de la empresa según el idioma
  const getCompanyName = () => {
    if (currentLanguage === 'en' && empresaData?.ingles) {
      return empresaData.ingles;
    }
    return empresaData?.nombre || (currentLanguage === 'en' ? 'Our Company' : 'Nuestra Empresa');
  };

  // Función segura para obtener datos de la empresa
  const getEmpresaData = (field) => {
    return empresaData?.[field] || (currentLanguage === 'en' ? 'Not available' : 'No disponible');
  };

  // Textos según idioma
  const texts = {
    sobre: currentLanguage === 'en' ? 'About' : 'Sobre',
    ubicacion: currentLanguage === 'en' ? 'Location' : 'Ubicación',
    telefono: currentLanguage === 'en' ? 'Phone' : 'Teléfono',
    correo_electronico: currentLanguage === 'en' ? 'Email' : 'Correo electrónico',
    cargando: currentLanguage === 'en' ? 'Loading...' : 'Cargando...',
    error_cargar_info: currentLanguage === 'en' ? 'Error loading information' : 'Error al cargar la información',
    no_disponible: currentLanguage === 'en' ? 'Not available' : 'No disponible'
  };

  // Función para construir la dirección del mapa de forma segura
  const getMapAddress = () => {
    if (!empresaData) return '';
    
    const addressParts = [
      empresaData.direccion,
      empresaData.codigo_postal,
      empresaData.poblacion,
      empresaData.provincia,
      empresaData.pais
    ].filter(part => part && part.trim() !== ''); // Filtrar partes vacías

    return addressParts.join(', ');
  };

  if (loading) return <div className="loading">{texts.cargando}</div>;
  if (error) return <div className="error">{texts.error_cargar_info}</div>;

  return (
    <div className="contact-container">
      <div className="company-header">
        <h1 className="contact-title">
          {texts.sobre} - {getCompanyName()}
        </h1>
      </div>

      <div className="contact-info-section">
        <div className="contact-item">
          <FaMapMarkerAlt className="contact-icon" />
          <div>
            <h3>{texts.ubicacion}</h3>
            <p>{getEmpresaData('direccion')}</p>
            <p>{getEmpresaData('codigo_postal')} {getEmpresaData('poblacion')}</p>
            <p>{getEmpresaData('provincia')}, {getEmpresaData('pais')}</p>
          </div>
        </div>

        <div className="contact-item">
          <FaPhone className="contact-icon" />
          <div>
            <h3>{texts.telefono}</h3>
            <p>{getEmpresaData('telefono')}</p>
          </div>
        </div>

        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <div>
            <h3>{texts.correo_electronico}</h3>
            <p>{getEmpresaData('email')}</p>
          </div>
        </div>
      </div>

      <div className="map-section">
        <iframe
          title="ubicacion"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(getMapAddress())}&output=embed`}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default Contacto;