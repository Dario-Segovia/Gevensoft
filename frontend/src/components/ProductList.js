import React from "react";
import "./ProductList.css"; // Asegúrate de que tienes el archivo CSS correspondiente

const ProductList = ({ productos }) => {
  return (
    <div className="product-list">
      {Array.isArray(productos) && productos.map((producto) => (
        <div className="product-card" key={producto.id_producto}>
          {producto.Url_imagen && (
            <img
              src={producto.Url_imagen}
              alt={producto.Nombre}
              className="product-image"
            />
          )}
          <div className="product-info">
            <h3 className="product-name">{producto.Nombre}</h3>
            <p className="product-description">{producto.DescripcionCorta}</p>
            <p className="product-cost">{producto.Coste} €</p>
          </div>
        </div>
      ))}
    </div>
  );
};

ProductList.defaultProps = {
  productos: [] // Valor por defecto como array vacío
};

export default ProductList;
