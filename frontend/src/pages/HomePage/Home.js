import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Home.css";
import logoLocal from '../../assets/background.jpg'; // Importamos la imagen local como fallback

function Home() {
  const { t } = useTranslation();
  const [empresaweb, setEmpresaWeb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(logoLocal);

  useEffect(() => {
    const fetchEmpresaWeb = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/empresaweb");
        const data = await res.json();
        setEmpresaWeb(data[0]);
        
        // Si hay datos y hay una URL de imagen, usarla
        if (data[0]?.url_image) {
          const imageUrl = getImageUrl(data[0].url_image);
          setBackgroundImage(imageUrl);
        }
      } catch (err) {
        setError(t("common.error_cargar_info"));
        console.error('Error fetching empresa web data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaWeb();
  }, [t]);

  // Función para construir la URL de la imagen
  const getImageUrl = (urlImage) => {
    if (!urlImage) return logoLocal;
    
    // Si la imagen ya es una URL completa
    if (urlImage.startsWith('http')) {
      return urlImage;
    }
    
    // Si es una ruta relativa, construir la URL completa
    return `http://localhost:3000${urlImage.startsWith('/') ? '' : '/'}${urlImage}`;
  };

  // Manejar error en la carga de la imagen
  const handleImageError = () => {
    console.warn('Error loading background image, using fallback');
    setBackgroundImage(logoLocal);
  };

  if (loading) return <div className="loading">{t("common.cargando")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <section
        className="hero-section"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          position: 'relative' // Para poder agregar un overlay si es necesario
        }}
      >
        {/* Preload la imagen para manejar errores */}
        <img 
          src={backgroundImage} 
          alt="" 
          style={{ display: 'none' }}
          onError={handleImageError}
        />
        <div className="hero-content">
          <h1 className="hero-title">
            {empresaweb?.Welcome_title || t("home.welcome_title")}
          </h1>
          <p className="hero-description">
            {empresaweb?.Welcome_text || t("home.welcome_text")}
          </p>
          <Link to="/carta" className="cta-button">
            {t("home.button_explora")}
          </Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>{empresaweb?.About_title || t("home.about_title")}</h2>
          <p>{empresaweb?.About_text || t("home.about_text")}</p>
          <Link to="/nosotros" className="cta-button">
            {t("home.button_historia")}
          </Link>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>{empresaweb?.Customer_title || t("home.customer_title")}</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"{empresaweb?.Customer_satisfied || t("home.customer_satisfied")}"</p>
            <span>- {t("home.cliente_satisfecho")}</span>
          </div>
          <div className="testimonial">
            <p>"{empresaweb?.Customer_appreciated || t("home.customer_appreciated")}"</p>
            <span>- {t("home.cliente_apreciado")}</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>{empresaweb?.Contact_title || t("home.contact_title")}</h2>
        <p>{empresaweb?.Contact_text || t("home.contact_text")}</p>
        <Link to="/contacto" className="cta-button">
          {t("home.button_contacto")}
        </Link>
      </section>
    </div>
  );
}

export default Home;