import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Hook para usar las traducciones
import "./Nosotros.css";

function Nosotros() {
  const { t } = useTranslation();  // Hook para acceder a las traducciones
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
        setError(t("common.error_cargar_info"));  // Traducción de error
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [t]);

  if (loading) return <div className="loading">{t("common.cargando")}</div>;  // Traducción "Cargando..."
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="nosotros-container">
      <div className="hero">
        <h1>{t("SobreNosotros.sobre")} {empresa?.nombre}</h1>  {/* Traducción de "Sobre" */}
        {empresa?.logo && (
          <img
            src={empresa.logo}
            alt={`Logo ${empresa?.nombre}`}
            className="logo"
          />
        )}
      </div>

      <section className="descripcion">
        <h2>{t("SobreNosotros.quienes_somos")}</h2>  {/* Traducción de "¿Quiénes somos?" */}
        <p>{empresa?.razon_social}</p>
        <p>{t("SobreNosotros.fundada")} {new Date(empresa?.fecha_alta).getFullYear()}</p>  {/* Traducción "Fundada en" */}
      </section>

      <section className="valores">
        <h2>{t("SobreNosotros.nuestros_valores")}</h2>  {/* Traducción de "Nuestros valores" */}
        <ul>
          <li>{t("valores.compromiso")}</li>  {/* Traducción de "Compromiso" */}
          <li>{t("valores.innovacion")}</li>  {/* Traducción de "Innovación" */}
          <li>{t("valores.calidad")}</li>  {/* Traducción de "Calidad" */}
          <li>{t("valores.transparencia")}</li>  {/* Traducción de "Transparencia" */}
        </ul>
      </section>

      <section className="ubicacion">
        <h2>{t("SobreNosotros.ubicacion")}</h2>  {/* Traducción de "Ubicación" */}
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
