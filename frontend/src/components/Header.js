import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <h1>Mi Restaurante</h1>
      <nav className="nav">
        <Link to="/" className="nav-button">
          Home
        </Link>
        <Link to="/carta" className="nav-button">
          Nuestra Carta
        </Link>
        <Link to="/nosotros" className="nav-button">
          Sobre Nosotros
        </Link>
        <Link to="/contacto" className="nav-button">
          Contacto
        </Link>
      </nav>
    </header>
  );
}

export default Header;