import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Home.css";

function Home() {
  const { t } = useTranslation();
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
        setError(t("common.error_cargar_info"));
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresaWeb();
  }, [t]);

  if (loading) return <div className="loading">{t("common.cargando")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-container">
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${empresaweb?.url_image})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{t("home.welcome_title")}</h1>
          <p className="hero-description">{t("home.welcome_text")}</p>
          <Link to="/carta" className="cta-button">
            {t("home.button_explora")}
          </Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>{t("home.about_title")}</h2>
          <p>{t("home.about_text")}</p>
          <Link to="/nosotros" className="cta-button">
            {t("home.button_historia")}
          </Link>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>{t("home.customer_title")}</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"{t("home.customer_satisfied")}"</p>
            <span>- {t("home.cliente_satisfecho")}</span>
          </div>
          <div className="testimonial">
            <p>"{t("home.customer_appreciated")}"</p>
            <span>- {t("home.cliente_apreciado")}</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>{t("home.contact_title")}</h2>
        <p>{t("home.contact_text")}</p>
        <Link to="/contacto" className="cta-button">
          {t("home.button_contacto")}
        </Link>
      </section>
    </div>
  );
}

export default Home;
