import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import "./Variantes.css";

const Variantes = ({ producto, varianteSeleccionada, onClose, onAgregar }) => {
  // Configuración de URLs - CORREGIDO
  const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
  const defaultImage = `${baseURL}/IMG/default.jpg`;

  // Estados
  const [indiceVariante, setIndiceVariante] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false); // Nuevo estado para controlar errores

  // Obtener idioma actual
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';

  // Textos según idioma
  const texts = {
    seleccionaVariante: currentLanguage === 'en' ? 'Select a variant' : 'Selecciona una variante',
    opcionesDisponibles: currentLanguage === 'en' ? 'Available options' : 'Opciones disponibles',
    seleccionaOpcion: currentLanguage === 'en' ? '-- Select an option (optional) --' : '-- Selecciona una opción (opcional) --',
    quitarOpcion: currentLanguage === 'en' ? 'Remove selected option' : 'Quitar opción seleccionada',
    total: currentLanguage === 'en' ? 'Total' : 'Total',
    anadirAlCarrito: currentLanguage === 'en' ? 'Add to cart' : 'Añadir al carrito',
    procesando: currentLanguage === 'en' ? 'Processing...' : 'Procesando...',
    cerrar: currentLanguage === 'en' ? 'Close' : 'Cerrar'
  };

  // Efectos para inicialización
  useEffect(() => {
    if (producto && varianteSeleccionada) {
      const idx = producto.variantes.findIndex(
        v => String(v.id_variante) === String(varianteSeleccionada.id_variante)
      );
      if (idx >= 0) setIndiceVariante(idx);
    }
  }, [producto, varianteSeleccionada]);

  // Reset image error cuando cambia la variante
  useEffect(() => {
    setImageError(false);
  }, [indiceVariante]);

  // Memoización de valores calculados
  const varianteActual = producto?.variantes[indiceVariante] || {};
  
  // Función para obtener el nombre del producto según el idioma
  const getProductName = (product) => {
    if (currentLanguage === 'en' && product['N-Ingles']) {
      return product['N-Ingles'];
    }
    return product.Nombre || 'Sin nombre';
  };

  // Función para obtener el nombre de la variante según el idioma
  const getVariantName = (variant) => {
    if (currentLanguage === 'en' && variant.Ingles) {
      return variant.Ingles;
    }
    return variant.Nombre || '';
  };

  // Función para obtener la descripción de la opción según el idioma
  const getOptionDescription = (option) => {
    if (currentLanguage === 'en' && option.ingles) {
      return option.ingles;
    }
    return option.descripcion || '';
  };

  const precioBase = parseFloat(varianteActual.Precio || varianteActual.Coste || 0);
  const precioExtra = opcionSeleccionada?.precio_extra || 0;
  const precioTotal = (precioBase + precioExtra) * cantidad;

  // Función MEJORADA para construir la URL de la imagen
  const getImagenPrincipal = useCallback(() => {
    // Si ya hubo un error, mostrar directamente la imagen por defecto
    if (imageError) {
      return defaultImage;
    }

    // Si no hay imagen de la variante, usar la por defecto
    if (!varianteActual.imagenes?.[0]) {
      return defaultImage;
    }

    const imagenVariante = varianteActual.imagenes[0];
    
    // Si la imagen ya es una URL completa, usarla directamente
    if (imagenVariante.startsWith('http')) {
      return imagenVariante;
    }
    
    // Si empieza con /, es una ruta absoluta
    if (imagenVariante.startsWith('/')) {
      return `${baseURL}${imagenVariante}`;
    }
    
    // Si es una ruta relativa, construir la URL completa
    return `${baseURL}/${imagenVariante}`;
  }, [varianteActual.imagenes, imageError, baseURL, defaultImage]);

  const imagenPrincipal = getImagenPrincipal();

  // Handler MEJORADO para errores de imagen
  const handleImageError = useCallback((e) => {
    console.warn('Error cargando imagen:', e.target.src);
    
    // Solo intentar cargar la imagen por defecto si no es ya la imagen por defecto
    if (e.target.src !== defaultImage) {
      setImageError(true);
      e.target.src = defaultImage;
    } else {
      // Si la imagen por defecto también falla, prevenir más intentos
      e.target.onerror = null;
      console.error('No se pudo cargar la imagen por defecto');
    }
  }, [defaultImage]);

  // Handlers optimizados
  const handleCambioVariante = useCallback((idx) => {
    setIndiceVariante(idx);
    setOpcionSeleccionada(null);
    setImageError(false); // Reset error al cambiar variante
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
            <h2 className="product-title">{getProductName(producto)}</h2>
            <p className="product-category">{producto.categoria}</p>
          </div>
          <button className="close-button" onClick={onClose} aria-label={texts.cerrar}>
            &times;
          </button>
        </header>

        {/* Selector de Variantes */}
        <section className="variante-selector-section">
          <h3 className="section-title">{texts.seleccionaVariante}</h3>
          <div className="variante-tabs">
            {producto.variantes.map((v, idx) => (
              <button
                key={`${v.id_variante}-${idx}`}
                className={`variante-tab ${idx === indiceVariante ? 'active' : ''}`}
                onClick={() => handleCambioVariante(idx)}
                aria-pressed={idx === indiceVariante}
              >
                <span className="variante-name">{getVariantName(v)}</span>
                <span className="variante-price">{parseFloat(v.Precio || 0).toFixed(2)}€</span>
              </button>
            ))}
          </div>
        </section>

        {/* Selector de Opciones */}
        {producto.opciones?.length > 0 && (
          <section className="opcion-selector-section">
            <h3 className="section-title">{texts.opcionesDisponibles}</h3>
            <div className="opcion-selector">
              <select
                value={opcionSeleccionada?.id_opcion || ""}
                onChange={handleCambioOpcion}
                className="opcion-dropdown"
                aria-label={texts.seleccionaOpcion}
              >
                <option value="">{texts.seleccionaOpcion}</option>
                {producto.opciones.map(opt => (
                  <option key={opt.id_opcion} value={opt.id_opcion}>
                    {getOptionDescription(opt)} {opt.precio_extra ? `(+${opt.precio_extra}€)` : ''}
                  </option>
                ))}
              </select>
              
              {opcionSeleccionada && (
                <div className="selected-option">
                  <span>{getOptionDescription(opcionSeleccionada)}</span>
                  <button 
                    className="clear-option"
                    onClick={() => setOpcionSeleccionada(null)}
                    aria-label={texts.quitarOpcion}
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
              alt={getVariantName(varianteActual)}
              className="product-image"
              onError={handleImageError}
              loading="lazy"
            />
          </div>

          <div className="product-info">
            <h3 className="product-variant-name">
              {getVariantName(varianteActual)}
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
            {texts.total}: <strong>{precioTotal.toFixed(2)}€</strong>
          </div>
          
          <button
            className="add-to-cart-btn"
            onClick={handleAgregarAlCarrito}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-indicator">{texts.procesando}</span>
            ) : (
              `${texts.anadirAlCarrito} (${cantidad})`
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
    'N-Ingles': PropTypes.string,
    categoria: PropTypes.string,
    variantes: PropTypes.arrayOf(
      PropTypes.shape({
        id_variante: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        Nombre: PropTypes.string,
        Ingles: PropTypes.string,
        Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        Descripcion: PropTypes.string,
        imagenes: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired,
    opciones: PropTypes.arrayOf(
      PropTypes.shape({
        id_opcion: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        descripcion: PropTypes.string.isRequired,
        ingles: PropTypes.string,
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