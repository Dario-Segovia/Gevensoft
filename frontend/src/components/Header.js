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
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';
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
      const empresa = Array.isArray(data) ? data[0] : data;
      setEmpresaData(empresa);
    } catch (err) {
      console.error('Error fetching empresa data:', err);
      setError(currentLanguage === 'en' ? 'Error loading data' : 'Error al cargar datos');
      // Datos de respaldo
      setEmpresaData({
        nombre: currentLanguage === 'en' ? 'My Restaurant' : 'Mi Restaurante',
        logo: logoLocal
      });
    } finally {
      setLoading(false);
    }
  }, [currentLanguage]);

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

  // Función para construir la URL del logo
  const getLogoUrl = () => {
    if (!empresaData?.logo) return logoLocal;
    
    if (empresaData.logo.startsWith('http')) {
      return empresaData.logo;
    }
    
    return `http://localhost:3000${empresaData.logo.startsWith('/') ? '' : '/'}${empresaData.logo}`;
  };

  // Función para obtener el nombre de la empresa según el idioma
  const getCompanyName = () => {
    if (currentLanguage === 'en' && empresaData?.ingles) {
      return empresaData.ingles;
    }
    return empresaData?.nombre || (currentLanguage === 'en' ? 'My Restaurant' : 'Mi Restaurante');
  };

  // Función para obtener el texto del footer según el idioma
  const getFooterText = () => {
    if (currentLanguage === 'en' && empresaData?.texto_footer_ingles) {
      return empresaData.texto_footer_ingles;
    }
    return empresaData?.texto_footer || texts.slogan;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    localStorage.setItem('logout', Date.now());
  };

  // Textos según idioma
  const texts = {
    home: currentLanguage === 'en' ? 'Home' : 'Inicio',
    productos: currentLanguage === 'en' ? 'Products' : 'Productos',
    sobreNosotros: currentLanguage === 'en' ? 'About Us' : 'Sobre Nosotros',
    contacto: currentLanguage === 'en' ? 'Contact' : 'Contacto',
    logoAlt: currentLanguage === 'en' ? 'Restaurant Logo' : 'Logo del Restaurante',
    slogan: currentLanguage === 'en' ? 'Quality and Tradition' : 'Calidad y Tradición',
    openMenu: currentLanguage === 'en' ? 'Open menu' : 'Abrir menú',
    closeMenu: currentLanguage === 'en' ? 'Close menu' : 'Cerrar menú',
    userMenu: currentLanguage === 'en' ? 'User menu' : 'Menú de usuario',
    profile: currentLanguage === 'en' ? 'Profile' : 'Perfil',
    logout: currentLanguage === 'en' ? 'Logout' : 'Cerrar Sesión',
    iniciarSesion: currentLanguage === 'en' ? 'Sign In' : 'Iniciar Sesión',
    cart: currentLanguage === 'en' ? 'Shopping cart' : 'Carrito de compras',
    dataError: currentLanguage === 'en' ? 'Error loading data' : 'Error al cargar datos'
  };

  if (loading && !empresaData) return (
    <div className="header-loading">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <button 
          className="mobile-menu-button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? texts.closeMenu : texts.openMenu}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="header-branding">
          <Link to="/" className="logo-link" aria-label={texts.home}>
            <img 
              src={getLogoUrl()}
              alt={texts.logoAlt} 
              className="header-logo"
              width="50"
              height="50"
              onError={(e) => {
                e.target.src = logoLocal;
              }}
            />
            <h1 className="header-title">
              {getCompanyName()}
              <span className="header-subtitle">{getFooterText()}</span>
            </h1>
          </Link>
        </div>

        <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-button" activeclassname="active">
            {texts.home}
          </Link>
          <Link to="/carta" className="nav-button" activeclassname="active">
            {texts.productos}
          </Link>
          <Link to="/nosotros" className="nav-button" activeclassname="active">
            {texts.sobreNosotros}
          </Link>
          <Link to="/contacto" className="nav-button" activeclassname="active">
            {texts.contacto}
          </Link>
        </nav>

        <div className="header-actions">
          <LanguageSwitcher compact={mobileMenuOpen} />
          
          {user ? (
            <div className="user-dropdown">
              <button className="user-button" aria-label={texts.userMenu}>
                <FaUser />
                <span className="user-name">{user.nombre.split(' ')[0]}</span>
              </button>
              <div className="dropdown-content">
                <Link to="/perfil" className="dropdown-item">
                  {texts.profile}
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <FaSignOutAlt /> {texts.logout}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="auth-button">
              {texts.iniciarSesion}
            </Link>
          )}

          <button
            className="cart-button"
            aria-label={texts.cart}
            onClick={() => setSideCartOpen(true)}
            data-badge={totalItems > 0 ? totalItems : null}
          >
            <FaShoppingCart />
          </button>
        </div>
      </header>
      
      <div className="header-spacer"></div>
      
      <SideCart 
        open={sideCartOpen} 
        onClose={() => setSideCartOpen(false)} 
      />
      
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