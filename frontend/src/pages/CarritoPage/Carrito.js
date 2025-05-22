import React from "react";
import { useCart } from "../../components/CartContext.jsx";
import "./Carrito.css";

function Carrito() {
  const { carrito, eliminarDelCarrito } = useCart();

  const total = carrito.reduce(
    (acc, item) => acc + item.Coste * item.cantidad,
    0
  ).toFixed(2);

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
                <button onClick={() => eliminarDelCarrito(item.id_producto)}>
                  ❌
                </button>
              </div>
            </div>
          ))}
          <div className="carrito-total">
            <strong>Total: {total} €</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
