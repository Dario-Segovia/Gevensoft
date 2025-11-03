import React from "react";
import { useCart } from "./CartContext.jsx";
import { useNavigate } from "react-router-dom";
import "./SideCart.css";

function SideCart({ open, onClose }) {
  const { carrito, eliminarDelCarrito } = useCart();
  const navigate = useNavigate();

  // Obtener idioma actual
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';

  // Textos según idioma
  const texts = {
    carritoVacio: currentLanguage === 'en' ? 'Cart is empty' : 'El carrito está vacío',
    opcion: currentLanguage === 'en' ? 'Option' : 'Opción',
    cantidad: currentLanguage === 'en' ? 'Quantity' : 'Cantidad',
    precio: currentLanguage === 'en' ? 'Price' : 'Precio',
    total: currentLanguage === 'en' ? 'Total' : 'Total',
    confirmarPedido: currentLanguage === 'en' ? 'Confirm order' : 'Confirmar pedido',
    eliminar: currentLanguage === 'en' ? 'Remove' : 'Eliminar'
  };

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
            <p>{texts.carritoVacio}</p>
          ) : (
            carrito.map(item => {
              const nombre =
                item.variante?.Nombre ??
                item.Nombre ??
                (item.variante ? "" : "Producto sin nombre");

              const precioUnitario = Number(
                item.variante?.Precio ??
                item.variante?.Coste ??
                item.Precio ??
                item.Coste ??
                0
              );

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
                        {texts.opcion}: {item.opcion.descripcion}
                      </div>
                    )}
                    <div>
                      {texts.cantidad}: {cantidad}
                    </div>
                    <div>
                      {texts.precio}: {parseFloat(precioUnitario).toFixed(2)} €
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
                    title={texts.eliminar}
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
            {texts.total}: <strong>{total} €</strong>
          </div>
          <button
            className="sidecart-confirm"
            disabled={carrito.length === 0}
            onClick={() => {
              onClose();
              navigate("/carrito");
            }}
          >
            {texts.confirmarPedido}
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default SideCart;