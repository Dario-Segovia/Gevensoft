import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from "../components/CartContext.jsx";
import LanguageSwitcher from '../LanguageSwitcher';
import "./Header.css";
import { useTranslation } from "react-i18next";
import logoLocal from '../assets/logo.jpg';
import SideCart from "./SideCart";

function Header() {
  const { t } = useTranslation();
  const { carrito } = useCart();
  const [empresaData, setEmpresaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [sideCartOpen, setSideCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Calcular total de items
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Efecto para el scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Debounce manual
    let ticking = false;
    const debouncedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, []);

  // Fetch datos de la empresa
  const fetchEmpresaData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/empresa');
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      
      const data = await response.json();
      setEmpresaData(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error('Error fetching empresa data:', err);
      setError(t("header.dataError"));
      // Datos de respaldo
      setEmpresaData({
        nombre: 'Mi Restaurante',
        logo: logoLocal
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchEmpresaData();
  }, [fetchEmpresaData]);

  // Verificar usuario al cargar
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('user');
        }
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    localStorage.setItem('logout', Date.now());
  };

  if (loading && !empresaData) return (
    <div className="header-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Hamburguer menu para móvil */}
        <button 
          className="mobile-menu-button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t("header.closeMenu") : t("header.openMenu")}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="header-branding">
          <Link to="/" className="logo-link" aria-label={t("header.home")}>
            <img 
              src={logoLocal}
              alt={t("header.logoAlt")} 
              className="header-logo"
              width="50"
              height="50"
            />
            <h1 className="header-title">
              {empresaData?.nombre || 'Mi Restaurante'}
              <span className="header-subtitle">{t("header.slogan")}</span>
            </h1>
          </Link>
        </div>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-button" activeclassname="active">
            {t("header.home")}
          </Link>
          <Link to="/carta" className="nav-button" activeclassname="active">
            {t("header.productos")}
          </Link>
          <Link to="/nosotros" className="nav-button" activeclassname="active">
            {t("header.sobreNosotros")}
          </Link>
          <Link to="/contacto" className="nav-button" activeclassname="active">
            {t("header.contacto")}
          </Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher compact={mobileMenuOpen} />
          
          {user ? (
            <div className="user-dropdown">
              <button className="user-button" aria-label={t("header.userMenu")}>
                <FaUser />
                <span className="user-name">{user.nombre.split(' ')[0]}</span>
              </button>
              <div className="dropdown-content">
                <Link to="/perfil" className="dropdown-item">
                  {t("header.profile")}
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <FaSignOutAlt /> {t("header.logout")}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="auth-button">
              {t("header.iniciarSesion")}
            </Link>
          )}

          <button
            className="cart-button"
            aria-label={t("header.cart")}
            onClick={() => setSideCartOpen(true)}
            data-badge={totalItems > 0 ? totalItems : null}
          >
            <FaShoppingCart />
          </button>
        </div>
      </header>
      
      <SideCart 
        open={sideCartOpen} 
        onClose={() => setSideCartOpen(false)} 
      />
      
      {/* Overlay para menú móvil */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;