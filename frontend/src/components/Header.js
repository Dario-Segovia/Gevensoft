import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/empresa');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setEmpresaData(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="header-loading">Cargando...</div>;
  if (error) return <div className="header-error">Error: {error}</div>;

  return (
    <header className="header">
      <div className="header-branding">
        {empresaData?.logo && (
          <Link to="/"> {/* Envolvemos el logo con el Link */}
            <img 
              src={empresaData.logo} 
              alt={`Logo ${empresaData.nombre}`} 
              className="header-logo"
            />
          </Link>
        )}
        <h1 className="header-title">{empresaData?.nombre || 'Mi Restaurante'}</h1>
      </div>

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
