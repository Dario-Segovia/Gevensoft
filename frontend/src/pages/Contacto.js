import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaGlobe } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import './Contacto.css';

function Contacto() {
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/empresa');
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        setEmpresaData(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="contact-container">
      <div className="company-header">
        <h1 className="contact-title">Contacto - {empresaData.nombre}</h1>
      </div>

      <div className="contact-info-section">
        <div className="contact-item">
          <FaMapMarkerAlt className="contact-icon" />
          <div>
            <h3>Dirección</h3>
            <p>{empresaData.direccion}</p>
            <p>{empresaData.codigo_postal} {empresaData.poblacion}</p>
            <p>{empresaData.provincia}, {empresaData.pais}</p>
          </div>
        </div>

        <div className="contact-item">
          <FaPhone className="contact-icon" />
          <div>
            <h3>Teléfono</h3>
            <p>{empresaData.telefono}</p>
          </div>
        </div>

        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <div>
            <h3>Correo Electrónico</h3>
            <p>{empresaData.email}</p>
          </div>
        </div>
      </div>

      <div className="map-section">
        <iframe
          title="ubicacion"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(`${empresaData.direccion}, ${empresaData.codigo_postal}, ${empresaData.poblacion}, ${empresaData.provincia}, ${empresaData.pais}`)}&output=embed`}          width="100%"
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