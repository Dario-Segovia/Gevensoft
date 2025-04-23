import React from "react";
import "./Header.css"; // Crea un archivo CSS para el header

function Header() {
  return (
    <header className="header">
      <h1>Mi Restaurante</h1>
      <nav className="nav">
        <button>Home</button>
        <button>Nuestra Carta</button>
        <button>Sobre Nosotros</button>
        <button>Contacto</button>
      </nav>
    </header>
  );
}

export default Header;
