import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./Variantes.css";

const Variantes = ({ producto, varianteSeleccionada, onClose, onAgregar }) => {
  // Configuración de URLs
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const defaultImage = `${baseURL}/IMG/default.jpg`;

  // Estados
  const [indiceVariante, setIndiceVariante] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  // Efectos para inicialización
  useEffect(() => {
    if (producto && varianteSeleccionada) {
      const idx = producto.variantes.findIndex(
        v => String(v.id_variante) === String(varianteSeleccionada.id_variante)
      );
      if (idx >= 0) setIndiceVariante(idx);
    }
  }, [producto, varianteSeleccionada]);

  // Memoización de valores calculados
  const varianteActual = producto?.variantes[indiceVariante] || {};
  const precioBase = parseFloat(varianteActual.Precio || varianteActual.Coste || 0);
  const precioExtra = opcionSeleccionada?.precio_extra || 0;
  const precioTotal = (precioBase + precioExtra) * cantidad;

  const imagenPrincipal = (
    varianteActual.imagenes?.[0] 
      ? `${baseURL}${varianteActual.imagenes[0]}`
      : defaultImage
  );

  // Handlers optimizados
  const handleCambioVariante = useCallback((idx) => {
    setIndiceVariante(idx);
    setOpcionSeleccionada(null);
  }, []);

  const handleCambioOpcion = useCallback((e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setOpcionSeleccionada(null);
    } else {
      const selected = producto.opciones.find(
        opt => String(opt.id_opcion) === selectedId
      );
      setOpcionSeleccionada(selected || null);
    }
  }, [producto?.opciones]);

  const handleAgregarAlCarrito = useCallback(async () => {
    if (!producto || loading) return;

    setLoading(true);
    try {
      const item = {
        ...producto,
        variante: varianteActual,
        id_item: producto.id_producto,
        tipo: "producto",
        cantidad,
        ...(opcionSeleccionada && { opcion: opcionSeleccionada })
      };

      await onAgregar(item);
      onClose();
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    } finally {
      setLoading(false);
    }
  }, [producto, varianteActual, opcionSeleccionada, cantidad, onAgregar, onClose, loading]);

  if (!producto) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content variante-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header del Modal */}
        <header className="modal-header">
          <div className="header-content">
            <h2 className="product-title">{producto.Nombre}</h2>
            <p className="product-category">{producto.categoria}</p>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </header>

        {/* Selector de Variantes */}
        <section className="variante-selector-section">
          <h3 className="section-title">Selecciona una variante</h3>
          <div className="variante-tabs">
            {producto.variantes.map((v, idx) => (
              <button
                key={`${v.id_variante}-${idx}`}
                className={`variante-tab ${idx === indiceVariante ? 'active' : ''}`}
                onClick={() => handleCambioVariante(idx)}
                aria-pressed={idx === indiceVariante}
              >
                <span className="variante-name">{v.Nombre || producto.Nombre}</span>
                <span className="variante-price">{parseFloat(v.Precio || 0).toFixed(2)}€</span>
              </button>
            ))}
          </div>
        </section>

        {/* Selector de Opciones */}
        {producto.opciones?.length > 0 && (
          <section className="opcion-selector-section">
            <h3 className="section-title">Opciones disponibles</h3>
            <div className="opcion-selector">
              <select
                value={opcionSeleccionada?.id_opcion || ""}
                onChange={handleCambioOpcion}
                className="opcion-dropdown"
                aria-label="Seleccionar opción"
              >
                <option value="">-- Selecciona una opción (opcional) --</option>
                {producto.opciones.map(opt => (
                  <option key={opt.id_opcion} value={opt.id_opcion}>
                    {opt.descripcion} {opt.precio_extra ? `(+${opt.precio_extra}€)` : ''}
                  </option>
                ))}
              </select>
              
              {opcionSeleccionada && (
                <div className="selected-option">
                  <span>{opcionSeleccionada.descripcion}</span>
                  <button 
                    className="clear-option"
                    onClick={() => setOpcionSeleccionada(null)}
                    aria-label="Quitar opción seleccionada"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Detalles del Producto */}
        <section className="product-details">
          <div className="product-image-container">
            <img
              src={imagenPrincipal}
              alt={varianteActual.Nombre || producto.Nombre}
              className="product-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
              loading="lazy"
            />
          </div>

          <div className="product-info">
            <h3 className="product-variant-name">
              {varianteActual.Nombre || producto.Nombre}
            </h3>
            
            {varianteActual.Descripcion && (
              <p className="product-description">{varianteActual.Descripcion}</p>
            )}

            <div className="price-display">
              <span className="base-price">{precioBase.toFixed(2)}€</span>
              {precioExtra > 0 && (
                <span className="extra-price">+ {precioExtra.toFixed(2)}€</span>
              )}
            </div>

            <div className="quantity-selector">
              <button 
                className="quantity-btn" 
                onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                disabled={cantidad <= 1}
              >
                −
              </button>
              <span className="quantity-value">{cantidad}</span>
              <button 
                className="quantity-btn" 
                onClick={() => setCantidad(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Footer del Modal */}
        <footer className="modal-footer">
          <div className="total-price">
            Total: <strong>{precioTotal.toFixed(2)}€</strong>
          </div>
          
          <button
            className="add-to-cart-btn"
            onClick={handleAgregarAlCarrito}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-indicator">Procesando...</span>
            ) : (
              `Añadir al carrito (${cantidad})`
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

// Prop Types para validación
Variantes.propTypes = {
  producto: PropTypes.shape({
    id_producto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Nombre: PropTypes.string.isRequired,
    categoria: PropTypes.string,
    variantes: PropTypes.arrayOf(
      PropTypes.shape({
        id_variante: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        Nombre: PropTypes.string,
        Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        Descripcion: PropTypes.string,
        imagenes: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired,
    opciones: PropTypes.arrayOf(
      PropTypes.shape({
        id_opcion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        descripcion: PropTypes.string.isRequired,
        precio_extra: PropTypes.number
      })
    )
  }),
  varianteSeleccionada: PropTypes.shape({
    id_variante: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onClose: PropTypes.func.isRequired,
  onAgregar: PropTypes.func.isRequired
};

export default Variantes;