import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Home.css";
import logoLocal from '../../assets/background.jpg';

function Home() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
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
        
        if (data[0]?.url_image) {
          const imageUrl = getImageUrl(data[0].url_image);
          setBackgroundImage(imageUrl);
        }
      } catch (err) {
        setError(currentLanguage === 'en' ? 'Error loading information' : 'Error al cargar la información');
        console.error('Error fetching empresa web data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaWeb();
  }, [currentLanguage]);

  // Función para construir la URL de la imagen
  const getImageUrl = (urlImage) => {
    if (!urlImage) return logoLocal;
    
    if (urlImage.startsWith('http')) {
      return urlImage;
    }
    
    return `http://localhost:3000${urlImage.startsWith('/') ? '' : '/'}${urlImage}`;
  };

  // Función para obtener texto traducido de empresaweb
  const getTranslatedText = (field) => {
    if (!empresaweb) return getDefaultText(field);
    
    if (currentLanguage === 'en') {
      // Buscar campo en inglés (sufijo _ingles)
      const englishField = empresaweb[`${field}_ingles`];
      return englishField || empresaweb[field] || getDefaultText(field);
    }
    return empresaweb[field] || getDefaultText(field);
  };

  // Textos por defecto
  const getDefaultText = (field) => {
    const defaultTexts = {
      Welcome_title: currentLanguage === 'en' ? 'Welcome to Our Restaurant' : 'Bienvenido a Nuestro Restaurante',
      Welcome_text: currentLanguage === 'en' ? 'Discover an unforgettable culinary experience' : 'Descubre una experiencia culinaria inolvidable',
      About_title: currentLanguage === 'en' ? 'Our Story' : 'Nuestra Historia',
      About_text: currentLanguage === 'en' ? 'Years of tradition and flavor' : 'Años de tradición y sabor',
      Customer_title: currentLanguage === 'en' ? 'What Our Customers Say' : 'Lo que Dicen Nuestros Clientes',
      Customer_satisfied: currentLanguage === 'en' ? 'Excellent service and incredible food!' : '¡Excelente servicio y comida increíble!',
      Customer_appreciated: currentLanguage === 'en' ? 'The best dining experience in town' : 'La mejor experiencia gastronómica de la ciudad',
      Contact_title: currentLanguage === 'en' ? 'Contact Us' : 'Contáctanos',
      Contact_text: currentLanguage === 'en' ? 'We are here to serve you' : 'Estamos aquí para servirte'
    };
    return defaultTexts[field] || '';
  };

  // Textos para botones
  const buttonTexts = {
    explora: currentLanguage === 'en' ? 'Explore Menu' : 'Explorar Carta',
    historia: currentLanguage === 'en' ? 'Our Story' : 'Nuestra Historia',
    contacto: currentLanguage === 'en' ? 'Contact Us' : 'Contáctanos'
  };

  const testimonialAuthors = {
    satisfecho: currentLanguage === 'en' ? 'Satisfied Customer' : 'Cliente Satisfecho',
    apreciado: currentLanguage === 'en' ? 'Valued Customer' : 'Cliente Apreciado'
  };

  // Manejar error en la carga de la imagen
  const handleImageError = () => {
    console.warn('Error loading background image, using fallback');
    setBackgroundImage(logoLocal);
  };

  if (loading) return <div className="loading">{currentLanguage === 'en' ? 'Loading...' : 'Cargando...'}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <section
        className="hero-section"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          position: 'relative'
        }}
      >
        <img 
          src={backgroundImage} 
          alt="" 
          style={{ display: 'none' }}
          onError={handleImageError}
        />
        <div className="hero-content">
          <h1 className="hero-title">
            {getTranslatedText('Welcome_title')}
          </h1>
          <p className="hero-description">
            {getTranslatedText('Welcome_text')}
          </p>
          <Link to="/carta" className="cta-button">
            {buttonTexts.explora}
          </Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>{getTranslatedText('About_title')}</h2>
          <p>{getTranslatedText('About_text')}</p>
          <Link to="/nosotros" className="cta-button">
            {buttonTexts.historia}
          </Link>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>{getTranslatedText('Customer_title')}</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"{getTranslatedText('Customer_satisfied')}"</p>
            <span>- {testimonialAuthors.satisfecho}</span>
          </div>
          <div className="testimonial">
            <p>"{getTranslatedText('Customer_appreciated')}"</p>
            <span>- {testimonialAuthors.apreciado}</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>{getTranslatedText('Contact_title')}</h2>
        <p>{getTranslatedText('Contact_text')}</p>
        <Link to="/contacto" className="cta-button">
          {buttonTexts.contacto}
        </Link>
      </section>
    </div>
  );
}

export default Home;