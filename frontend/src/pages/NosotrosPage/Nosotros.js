import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Nosotros.css";
import logoLocal from '../../assets/logo.jpg'; 

function Nosotros() {
  const { t } = useTranslation();
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/empresa");
        const data = await res.json();
        setEmpresa(data[0]);
      } catch (err) {
        setError(t("common.error_cargar_info"));
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [t]);

  // Función para construir la URL del logo - CORREGIDA
  const getLogoUrl = () => {
    if (!empresa?.logo) return logoLocal;
    
    // Si el logo ya es una URL completa
    if (empresa.logo.startsWith('http')) {
      return empresa.logo;
    }
    
    // Si es una ruta relativa, construir la URL completa
    return `http://localhost:3000${empresa.logo.startsWith('/') ? '' : '/'}${empresa.logo}`;
  };

  if (loading) return <div className="loading">{t("common.cargando")}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="nosotros-container">
      <div className="hero">
        <h1>{t("SobreNosotros.sobre")} {empresa?.nombre}</h1>
        {/* Mostrar siempre la imagen, usando el fallback si es necesario */}
        <img 
          src={getLogoUrl()}
          alt="Logo del restaurante" 
          className="header-logo"
        />
      </div>

      <section className="descripcion">
        <h2>{t("SobreNosotros.quienes_somos")}</h2>
        <p>{empresa?.razon_social}</p>
        <p>{t("SobreNosotros.fundada")} {new Date(empresa?.fecha_alta).getFullYear()}</p>
      </section>

      <section className="valores">
        <h2>{t("SobreNosotros.nuestros_valores")}</h2>
        <ul>
          <li>{t("valores.compromiso")}</li>
          <li>{t("valores.innovacion")}</li>
          <li>{t("valores.calidad")}</li>
          <li>{t("valores.transparencia")}</li>
        </ul>
      </section>

      <section className="ubicacion">
        <h2>{t("SobreNosotros.ubicacion")}</h2>
        <p>
          {empresa?.direccion}, {empresa?.codigo_postal}
        </p>
        <p>
          {empresa?.poblacion}, {empresa?.provincia}, {empresa?.pais}
        </p>
      </section>

      <footer className="footer-nosotros">
        {t("SobreNosotros.texto_footer")}
      </footer>
    </div>
  );
}

export default Nosotros;