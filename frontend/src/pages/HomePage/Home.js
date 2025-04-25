import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Asegúrate de tener un archivo de estilo separado

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenido a {process.env.REACT_APP_APP_NAME || "Mi Restaurante"}</h1>
          <p className="hero-description">
            Un lugar donde la comida se convierte en una experiencia única. Disfruta de platos deliciosos y de una atmósfera acogedora.
          </p>
          <Link to="/carta" className="cta-button">Explora nuestra Carta</Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>Sobre Nosotros</h2>
          <p>
            Con más de 20 años de experiencia, nuestro restaurante ofrece una fusión de sabores locales e internacionales. Nos apasiona la comida y creemos que cada plato cuenta una historia.
          </p>
          <Link to="/nosotros" className="cta-button">Conoce nuestra Historia</Link>
        </div>
      </section>

      <section className="testimonial-section">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"¡Una experiencia increíble! La comida es deliciosa y el ambiente es perfecto para una noche especial."</p>
            <span>- Cliente Satisfecho</span>
          </div>
          <div className="testimonial">
            <p>"El mejor restaurante de la ciudad. Volveré sin duda. ¡Recomiendo probar el plato del día!"</p>
            <span>- Cliente Apreciado</span>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <h2>¿Te gustaría visitarnos?</h2>
        <p>Estamos ubicados en el corazón de la ciudad, listos para ofrecerte lo mejor de la gastronomía.</p>
        <Link to="/contacto" className="cta-button">Contáctanos</Link>
      </section>
    </div>
  );
}

export default Home;
