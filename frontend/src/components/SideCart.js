import React from "react";
import { useCart } from "./CartContext.jsx";
import { useNavigate } from "react-router-dom";
import "./SideCart.css";

function SideCart({ open, onClose }) {
  const { carrito, eliminarDelCarrito } = useCart();
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acc, item) => {
      const precioUnitario = Number(
        item.variante?.Precio ??
        item.variante?.Coste ??
        item.Coste ??
        item.Precio ??
        0
      );
      return acc + precioUnitario * (item.cantidad ?? 1);
    },
    0
  ).toFixed(2);

  return (
    <div className={`sidecart-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <aside
        className={`sidecart ${open ? "open" : ""}`}
        onClick={e => e.stopPropagation()}
      >
        
        <div className="sidecart-content">
          {carrito.length === 0 ? (
            <p>El carrito está vacío.</p>
          ) : (
            carrito.map(item => {
              // Nombre
              const nombre =
                item.variante?.Nombre ??
                item.Nombre ??
                (item.variante ? "" : "Producto sin nombre");

              // Precio unitario
              const precioUnitario = Number(
                item.variante?.Precio ??
                item.variante?.Coste ??
                item.Precio ??
                item.Coste ??
                0
              );

              // Cantidad
              const cantidad = item.cantidad ?? 1;

              return (
                <div
                  key={`${item.id_producto}-${item.variante?.id_variante ?? "base"}-${item.opcion?.id_opcion || ""}`}
                  className="sidecart-item"
                >
                  <div>
                    <strong>{nombre}</strong>
                    {item.opcion && (
                      <div className="sidecart-opcion">
                        Opción: {item.opcion.descripcion}
                      </div>
                    )}
                    <div>
                      Cantidad: {cantidad}
                    </div>
                    <div>
                      Precio: {parseFloat(precioUnitario).toFixed(2)} €
                    </div>
                  </div>
                  <button
                    className="sidecart-remove"
                    onClick={() =>
                      eliminarDelCarrito(
                        item.id_producto,
                        item.variante?.id_variante,
                        item.opcion?.id_opcion
                      )
                    }
                    title="Eliminar"
                  >
                    ❌
                  </button>
                </div>
              );
            })
          )}
        </div>
        <footer className="sidecart-footer">
          <div className="sidecart-total">
            Total: <strong>{total} €</strong>
          </div>
          <button
            className="sidecart-confirm"
            disabled={carrito.length === 0}
            onClick={() => {
              onClose();
              navigate("/carrito");
            }}
          >
            Confirmar pedido
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default SideCart;