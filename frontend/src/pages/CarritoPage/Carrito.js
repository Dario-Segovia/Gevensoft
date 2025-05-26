import React, { useContext, useState } from "react";
import { useCart } from "../../components/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import "./Carrito.css";

// Supón que tienes un contexto de usuario
import { UserContext } from "../../components/UserContext.js";

function Carrito() {
  const { carrito, eliminarDelCarrito, limpiarCarrito } = useCart();
  const { user } = useContext(UserContext); // user: { id, nombre, email }
  const [loading, setLoading] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const total = carrito
    .reduce(
      (acc, item) =>
        acc +
        (item.variante?.Precio || item.variante?.Coste || item.Coste) *
          item.cantidad,
      0
    )
    .toFixed(2);

  const handleHacerPedido = async () => {
    setLoading(true);
    setError("");
    try {
      const contenido = carrito.map((item) => ({
        id_variante: item.variante?.id_variante,
        cantidad: item.cantidad,
        precio_unitario: item.variante?.Precio || item.variante?.Coste || item.Coste,
        descuento: 0,
        notas: "",
      }));

      const res = await fetch("http://localhost:3000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_cliente: user.id,
          total,
          contenido,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el pedido");
      }
      setPedidoEnviado(true);
      limpiarCarrito();
    } catch (err) {
      setError("No se pudo enviar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="carrito-container">
        <h2>Tu carrito</h2>
        <p>Debes iniciar sesión para hacer un pedido.</p>
        <button onClick={() => navigate("/login")}>Iniciar sesión</button>
      </div>
    );
  }

  if (pedidoEnviado) {
    return (
      <div className="carrito-container">
        <h2>Pedido realizado</h2>
        <p>
          ¡Gracias por tu compra! Revisa tu correo para ver el resumen del pedido.
        </p>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2>Tu carrito</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="carrito-lista">
          {carrito.map((item) => (
            <div key={item.id_producto} className="carrito-item">
              <div className="info">
                <h4>
                  {item.variante?.Nombre
                    ? `${item.Nombre}`
                    : item.Nombre}
                </h4>
                <p>Cantidad: {item.cantidad}</p>
                <p>
                  Precio:{" "}
                  {parseFloat(
                    item.variante?.Precio || item.variante?.Coste || item.Coste
                  ).toFixed(2)} €
                </p>
              </div>
              <div className="subtotal">
                Subtotal: {(
                  (item.variante?.Precio || item.variante?.Coste || item.Coste) *
                  item.cantidad
                ).toFixed(2)} €
                <button onClick={() =>
  eliminarDelCarrito(item.id_producto, item.variante?.id_variante)
}>
  ❌
</button>

              </div>
            </div>
          ))}
          <div className="carrito-total">
            <strong>Total: {total} €</strong>
          </div>
          <button
            className="btn-hacer-pedido"
            onClick={handleHacerPedido}
            disabled={loading}
          >
            {loading ? "Enviando pedido..." : "Hacer pedido"}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default Carrito;
