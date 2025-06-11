import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(item) {
    setCarrito((prev) => {
      // Busca si ya existe el mismo producto/variante/opción
      const idx = prev.findIndex(
        (i) =>
          i.id_producto === item.id_producto &&
          i.variante?.id_variante === item.variante?.id_variante &&
          ((i.opcion?.id_opcion || null) === (item.opcion?.id_opcion || null))
      );
      if (idx >= 0) {
        // Si existe, suma la cantidad
        const nuevo = [...prev];
        nuevo[idx] = {
          ...nuevo[idx],
          cantidad: nuevo[idx].cantidad + item.cantidad,
        };
        return nuevo;
      } else {
        // Si no existe, lo añade
        return [...prev, item];
      }
    });
  }

  function eliminarDelCarrito(id_producto, id_variante, id_opcion) {
    setCarrito((prev) =>
      prev.filter(
        (item) =>
          item.id_producto !== id_producto ||
          item.variante?.id_variante !== id_variante ||
          (item.opcion?.id_opcion || null) !== (id_opcion || null)
      )
    );
  }

  function actualizarCantidad(id_producto, id_variante, id_opcion, nuevaCantidad) {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id_producto === id_producto &&
        item.variante?.id_variante === id_variante &&
        ((item.opcion?.id_opcion || null) === (id_opcion || null))
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  }

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, actualizarCantidad }}
    >
      {children}
    </CartContext.Provider>
  );
}

