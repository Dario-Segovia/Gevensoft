import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find(
        (item) =>
          item.id_producto === producto.id_producto &&
          item.variante?.id_variante === producto.variante?.id_variante &&
          item.opcion?.id_opcion === producto.opcion?.id_opcion
      );

      if (existe) {
        return prev.map((item) =>
          item.id_producto === producto.id_producto &&
          item.variante?.id_variante === producto.variante?.id_variante &&
          item.opcion?.id_opcion === producto.opcion?.id_opcion
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (id_producto, id_variante, id_opcion) => {
    setCarrito((prev) =>
      prev.filter(
        (item) =>
          item.id_producto !== id_producto ||
          item.variante?.id_variante !== id_variante ||
          item.opcion?.id_opcion !== id_opcion
      )
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito }}
    >
      {children}
    </CartContext.Provider>
  );
}

