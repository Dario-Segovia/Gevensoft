import React, { useContext, useState, useEffect } from "react";
import { useCart } from "../../components/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/UserContext.js";
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./Carrito.css";

function Carrito() {
  const { carrito, eliminarDelCarrito, limpiarCarrito, actualizarCantidad } = useCart();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  // Efecto para resetear el estado cuando el carrito está vacío
  useEffect(() => {
    if (carrito.length === 0 && pedidoEnviado) {
      const timer = setTimeout(() => setPedidoEnviado(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [carrito, pedidoEnviado]);

  const total = carrito.reduce(
    (acc, item) => acc + (item.variante?.Precio || item.variante?.Coste || item.Coste) * item.cantidad,
    0
  ).toFixed(2);

  const handleHacerPedido = async () => {
    setLoading(true);
    setError("");
    
    try {
      const contenido = carrito.map((item) => ({
        id_producto: item.id_producto,
        id_variante: item.variante?.id_variante,
        cantidad: item.cantidad,
        precio_unitario: item.variante?.Precio || item.variante?.Coste || item.Coste,
        descuento: 0,
        notas: "",
        opcion: item.opcion ? { ...item.opcion } : null,
      }));

      const res = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          id_cliente: user?.id,
          total,
          contenido,
          direccion_entrega: user?.direccion || "",
          notas_entrega: ""
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el pedido");
      }

      // Notificación de éxito
      setPedidoEnviado(true);
      limpiarCarrito();
      
      // Enviar evento de conversión para analytics
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-123456789/AbC-D_efGhIjKlMnOpQrSt',
          'value': total,
          'currency': 'EUR',
          'transaction_id': Date.now().toString()
        });
      }

    } catch (err) {
      console.error("Error en el pedido:", err);
      setError(err.message || "No se pudo completar el pedido. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  
  const confirmDelete = (idProducto, idVariante, idOpcion) => {
    setItemToDelete({ idProducto, idVariante, idOpcion });
    setShowConfirmation(true);
  };

  const handleDeleteConfirmed = () => {
    eliminarDelCarrito(itemToDelete.idProducto, itemToDelete.idVariante, itemToDelete.idOpcion);
    setShowConfirmation(false);
    setItemToDelete(null);
  };

  const handleQuantityChange = (item, newQuantity) => {
    const quantity = Math.max(1, Math.min(99, parseInt(newQuantity) || 1));
    actualizarCantidad(item.id_producto, item.variante?.id_variante, item.opcion?.id_opcion, quantity);
  };

  const baseURL = "http://localhost:3000";
  const getImagenProducto = (item) => {
    if (item.variante?.imagenes?.[0]) {
      // Si la ruta ya empieza por "/", solo concatena baseURL
      const ruta = item.variante.imagenes[0];
      return ruta.startsWith("/")
        ? `${baseURL}${ruta}`
        : `${baseURL}/IMG/${ruta}`;
    }
    if (item.Imagen) {
      return item.Imagen.startsWith("/")
        ? `${baseURL}${item.Imagen}`
        : `${baseURL}/IMG/${item.Imagen}`;
    }
    return `${baseURL}/IMG/default.jpg`;
  };

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="carrito-container"
      >
        <div className="empty-cart">
          <FiShoppingBag size={48} className="empty-icon" />
          <h2>Tu carrito</h2>
          <p>Debes iniciar sesión para realizar un pedido</p>
          <div className="button-group">
            <button 
              className="btn-primary"
              onClick={() => navigate("/login", { state: { from: "/carrito" } })}
            >
              Iniciar sesión
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate("/")}
            >
              Seguir comprando
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (pedidoEnviado) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="success-container"
      >
        <div className="success-content">
          <FiCheckCircle size={64} className="success-icon" />
          <h2>¡Pedido realizado con éxito!</h2>
          <p>Hemos enviado los detalles a tu correo electrónico.</p>
          <p className="order-number">Nº de pedido: #{Math.floor(Math.random() * 1000000)}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/mis-pedidos")}
          >
            Ver mis pedidos
          </button>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="carrito-container"
    >
      <div className="cart-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Volver
        </button>
        <h2>Tu carrito</h2>
        <div className="cart-summary">
          {carrito.length > 0 && (
            <span>{carrito.length} {carrito.length === 1 ? 'artículo' : 'artículos'}</span>
          )}
        </div>
      </div>

      {carrito.length === 0 ? (
        <div className="empty-cart">
          <FiShoppingBag size={48} className="empty-icon" />
          <p>Tu carrito está vacío</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/carta")}
          >
            Explorar productos
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <AnimatePresence>
              {carrito.map((item) => {
                console.log("Carrito item:", item);
                return (
                  <motion.div
                    key={`${item.id_producto}-${item.variante?.id_variante}-${item.opcion?.id_opcion || ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="cart-item"
                  >
                    <div className="item-image">
                   <img
  src={getImagenProducto(item)}
  alt={item.Nombre}
  className="product-image"
  onError={e => {
    e.target.onerror = null;
    e.target.src = `${baseURL}/IMG/default.jpg`;
  }}
/>
                    </div>
                    <div className="item-details">
                      <h4>{item.variante?.Nombre || item.Nombre}</h4>
                      
                      {item.opcion && (
                        <p className="item-option">
                          <span>Opción:</span> {item.opcion.descripcion}
                          {item.opcion.PrecioExtra > 0 && (
                            <span> (+{item.opcion.PrecioExtra.toFixed(2)}€)</span>
                          )}
                        </p>
                      )}

                      <div className="item-quantity">
                        <button 
                          onClick={() => handleQuantityChange(item, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={item.cantidad}
                          onChange={(e) => handleQuantityChange(item, e.target.value)}
                        />
                        <button 
                          onClick={() => handleQuantityChange(item, item.cantidad + 1)}
                          disabled={item.cantidad >= 99}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-price">
                      <div className="price-container">
                        <span>
                          {Number(item.variante?.Precio ?? item.variante?.Coste ?? item.Coste ?? 0).toFixed(2)} €
                        </span>
                        <span className="subtotal">
                          {(item.cantidad * Number(item.variante?.Precio ?? item.variante?.Coste ?? item.Coste ?? 0)).toFixed(2)} €
                        </span>
                      </div>
                      <button 
                        className="delete-item"
                        onClick={() => confirmDelete(item.id_producto, item.variante?.id_variante, item.opcion?.id_opcion)}
                        aria-label="Eliminar producto"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="cart-summary-container">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{total} €</span>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{total} €</span>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}

            <button
              className={`checkout-button ${loading ? 'loading' : ''}`}
              onClick={handleHacerPedido}
              disabled={loading || carrito.length === 0}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  Procesando pedido...
                </>
              ) : (
                `Finalizar compra (${total} €)`
              )}
            </button>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div 
            className="confirmation-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="confirmation-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3>¿Eliminar producto?</h3>
              <p>¿Estás seguro de que quieres eliminar este producto de tu carrito?</p>
              <div className="modal-buttons">
                <button 
                  className="btn-cancel"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-confirm"
                  onClick={handleDeleteConfirmed}
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Carrito;