import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from "../components/CartContext.jsx";
import LanguageSwitcher from '../LanguageSwitcher';  // Asegúrate de importar el componente
import "./Header.css";
import { useTranslation } from "react-i18next"; // Importa el hook para traducción
import logoLocal from '../assets/logo.jpg';
import SideCart from "./SideCart";

function Header() {
  const { t } = useTranslation();
  const { carrito } = useCart(); // Accedemos al carrito del contexto
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [sideCartOpen, setSideCartOpen] = useState(false);

  // Calcular total de items
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (loading) return <div className="header-loading">Cargando...</div>;
  if (error) return <div className="header-error">Error: {error}</div>;

  return (
    <>
      <header className="header">
        <div className="header-branding">
          {empresaData?.logo && (
            <Link to="/"> {/* Envolvemos el logo con el Link */}
            <img 
src={logoLocal}
alt="Logo del restaurante" 
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
          {t("header.productos")}
          </Link>
          <Link to="/nosotros" className="nav-button">
          {t("header.sobreNosotros")}
          </Link>
          <Link to="/contacto" className="nav-button">
          {t("header.contacto")}
          </Link>
       
          {user ? (
            <>
              <span className="nav-user">Hola, {user.nombre}</span>
              <button onClick={() => { localStorage.removeItem('user'); setUser(null); }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/auth" className="nav-button">
              {t("header.iniciarSesion")}
            </Link>
          )}
        </nav>

        {/* Agrega el LanguageSwitcher donde quieras en el header */}
        <div className="language-switcher-container">
          <LanguageSwitcher />
        </div>
         <button
  className="nav-button nav-icon"
  aria-label="Carrito"
  style={{ background: "none", border: "none", position: "relative" }}
  onClick={() => setSideCartOpen(open => !open)} // Cambia aquí
>
  <FaShoppingCart style={{ fontSize: '1.5rem' }} />
  {totalItems > 0 && (
    <span className="cart-badge">{totalItems}</span>
  )}
</button>
      </header>
      <SideCart open={sideCartOpen} onClose={() => setSideCartOpen(false)} />
    </>
  );
}

export default Header;
