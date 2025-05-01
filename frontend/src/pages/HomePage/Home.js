import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css"; // Asegúrate de tener un archivo de estilo separado

function Home() {
  const [empresaweb, setEmpresaWeb] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresaWeb = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/empresaweb");
        const data = await res.json();
        setEmpresaWeb(data[0]);
      } catch (err) {
        setError("No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaWeb();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <section className="hero-section" style={{ backgroundImage: `url(${empresaweb.url_image})` }}>
        <div className="hero-content">
          <h1 className="hero-title">{empresaweb.Welcome_title}</h1>
          <p className="hero-description">{empresaweb.Welcome_text}</p>
          <Link to="/carta" className="cta-button">Explora nuestros Productos</Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>{empresaweb.About_title}</h2>
          <p>{empresaweb.About_text}</p>
          <Link to="/nosotros" className="cta-button">Conoce nuestra Historia</Link>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>{empresaweb.Customer_title}</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"{empresaweb.Customer_satisfied}"</p>
            <span>- Cliente Satisfecho</span>
          </div>
          <div className="testimonial">
            <p>"{empresaweb.Customer_appreciated}"</p>
            <span>- Cliente Apreciado</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>{empresaweb.Contact_title}</h2>
        <p>{empresaweb.Contact_text}</p>
        <Link to="/contacto" className="cta-button">Contáctanos</Link>
      </section>
    </div>
  );
}

export default Home;
