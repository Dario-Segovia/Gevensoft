import React, { useState, useEffect, useCallback } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./ProductList.css";
import debounce from "lodash.debounce";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../components/CartContext.jsx";
import { useTranslation } from "react-i18next";
import Variantes from "../VariantesPage/Variantes";

const baseURL = "http://localhost:3000";

const ProductList = ({ productos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sliderValue, setSliderValue] = useState([0, 10]);
  const [modalProducto, setModalProducto] = useState(null);

  const { agregarAlCarrito } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    if (productos.length > 0) {
      const precios = productos.map((p) => parseFloat(p.Coste || 0));
      const min = Math.floor(Math.min(...precios));
      const max = Math.ceil(Math.max(...precios));
      setSliderValue([min, max]);
      setPriceRange([min, max]);
    }
  }, [productos]);

  const productosConPrimeraVariante = Object.values(
    productos.reduce((acc, producto) => {
      const id = producto.id_producto;
      if (!acc[id]) {
        acc[id] = producto;
      }
      return acc;
    }, {})
  );

  const filteredProducts = productosConPrimeraVariante.filter((producto) => {
    if (!producto) return false;
    const productName = String(producto.Nombre || "");
    const searchTermLower = String(searchTerm || "").toLowerCase();
    const productCost = Number(producto.Coste) || 0;
    return (
      productName.toLowerCase().includes(searchTermLower) &&
      productCost >= priceRange[0] &&
      productCost <= priceRange[1]
    );
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSliderChange = (newPriceRange) => {
    setSliderValue(newPriceRange);
  };

  const handlePriceChange = useCallback(
    debounce((newPriceRange) => {
      setPriceRange(newPriceRange);
    }, 500),
    []
  );

  useEffect(() => {
    handlePriceChange(sliderValue);
  }, [sliderValue, handlePriceChange]);

  const agregarYCerrar = (item) => {
    agregarAlCarrito(item);
  };

  return (
    <div className="product-list-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder={t("common.buscar_producto")}
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="price-filter">
          <label>
            {t("common.rango_precio")}: {sliderValue[0].toFixed(2)} € -{" "}
            {sliderValue[1].toFixed(2)} €
          </label>
          <RangeSlider
            min={0}
            max={10}
            step={0.01}
            value={sliderValue}
            onInput={handleSliderChange}
          />
        </div>
      </div>

      <div className="product-list">
        {filteredProducts.map((producto) => {
          const primeraVariante =
            producto.variantes && producto.variantes.length > 0
              ? producto.variantes[0]
              : null;
          const primeraImagen =
            primeraVariante?.imagenes?.[0]
              ? `${primeraVariante.imagenes[0]}`
              : `${baseURL}/default.jpg`;

          return (
            <div key={producto.id_producto} className="product-card">
            <div className="product-image-container">
              <img
                src={primeraImagen}
                alt={producto.Nombre}
                className="product-image"
                onError={(e) => {
                  console.error("Error loading image:", e);
                  e.target.onerror = null;
                  e.target.src = `${baseURL}/default.jpg`;
                }}
              />
            </div>

            <div className="product-info">
              <h3 className="product-name">{producto.Nombre}</h3>
              <p className="product-description">{producto.DescipcionCorta}</p>
              <p className="product-cost">
                {parseFloat(producto.Coste).toFixed(2)} €
              </p>
            </div>

            <button
              className="add-to-cart-button"
              onClick={() => {
                if (producto.variantes && producto.variantes.length === 1) {
                  agregarAlCarrito({
                    id_producto: producto.id_producto,
                    id_item: producto.id_producto,
                    tipo: "producto",
                    Nombre: producto.Nombre,
                    descripcion: producto.DescipcionCorta,
                    variante: producto.variantes[0],
                    cantidad: 1,
                    Coste: parseFloat(producto.variantes[0].Precio ?? producto.variantes[0].Coste ?? producto.Coste ?? 0)
                  });
                } else if (producto.variantes && producto.variantes.length > 1) {
                  setModalProducto(producto);
                } else {
                  agregarAlCarrito({
                    id_producto: producto.id_producto,
                    id_item: producto.id_producto,
                    tipo: "producto",
                    Nombre: producto.Nombre,
                    descripcion: producto.DescipcionCorta,
                    cantidad: 1,
                    Coste: parseFloat(producto.Coste ?? 0)
                  });
                }
              }}
              title={t("common.agregar_al_carrito")}
            >
              <FaShoppingCart />
            </button>
          </div>
          );
        })}
      </div>

      {modalProducto && (
        <Variantes
          producto={modalProducto}
          onClose={() => setModalProducto(null)}
          onAgregar={(item) => {
            // Si hay variante, sobreescribe los datos principales con los de la variante seleccionada
            const variante = item.variante;
            agregarAlCarrito({
              ...item,
              Nombre: variante?.Nombre || item.Nombre,
              Coste: variante?.Precio || variante?.Coste || item.Coste,
              id_variante: variante?.id_variante,
            });
            setModalProducto(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
