import { useState, useEffect } from "react";
import "./Nosotros.css";

function Nosotros() {
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
        setError("No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="nosotros-container">
      <div className="hero">
        <h1>Sobre {empresa.nombre}</h1>
        {empresa?.logo && (
          <img
            src={empresa.logo}
            alt={`Logo ${empresa.nombre}`}
            className="logo"
          />
        )}
      </div>

      <section className="descripcion">
        <h2>¿Quiénes somos?</h2>
        <p>{empresa.razon_social}</p>
        <p>Fundada en {new Date(empresa.fecha_alta).getFullYear()}</p>
      </section>

      <section className="valores">
        <h2>Nuestros valores</h2>
        <ul>
          <li>Compromiso</li>
          <li>Innovación</li>
          <li>Calidad</li>
          <li>Transparencia</li>
        </ul>
      </section>

      <section className="ubicacion">
        <h2>Ubicación</h2>
        <p>
          {empresa.direccion}, {empresa.codigo_postal}
        </p>
        <p>
          {empresa.poblacion}, {empresa.provincia}, {empresa.pais}
        </p>
      </section>

      <footer className="footer-nosotros">
        <p>{empresa.texto_footer}</p>
      </footer>
    </div>
  );
}

export default Nosotros;
