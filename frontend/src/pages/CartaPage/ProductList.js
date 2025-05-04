import React, { useState, useEffect, useCallback } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./ProductList.css";
import debounce from "lodash.debounce";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../components/CartContext.jsx";
import { useTranslation } from "react-i18next"; // <-- Importar i18n

const ProductList = ({ productos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [sliderValue, setSliderValue] = useState([0, 10]);

  const { agregarAlCarrito } = useCart();
  const { t } = useTranslation(); // <-- Inicializar i18n

  useEffect(() => {
    if (productos.length > 0) {
      const precios = productos.map((p) => p.Coste);
      const min = Math.floor(Math.min(...precios));
      const max = Math.ceil(Math.max(...precios));
      setSliderValue([min, max]);
      setPriceRange([min, max]);
    }
  }, [productos]);

  const filteredProducts = productos.filter(
    (producto) =>
      t(`productos.${producto.Nombre}`).toLowerCase().includes(searchTerm.toLowerCase()) &&
      producto.Coste >= priceRange[0] &&
      producto.Coste <= priceRange[1]
  );

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
            {t("common.rango_precio")}: {sliderValue[0].toFixed(2)} € - {sliderValue[1].toFixed(2)} €
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
        {filteredProducts.map((producto) => (
          <div className="product-card" key={producto.id_producto}>
            {producto.Url_imagen && (
              <img
                src={producto.Url_imagen}
                alt={t(`productos.${producto.Nombre}`)} // Usamos el nombre directamente como clave
                className="product-image"
              />
            )}
            <div className="product-info">
              <h3 className="product-name">{t(`productos.${producto.Nombre}`)}</h3> {/* Traducción directa */}
              <p className="product-description">{t(`productos.${producto.DescripcionCorta}`)}</p>
              <p className="product-cost">
                {typeof producto.Coste === "number"
                  ? producto.Coste.toFixed(2)
                  : parseFloat(producto.Coste).toFixed(2)}{" "}
                €
              </p>
            </div>
            <button
              className="add-to-cart-button"
              onClick={() => agregarAlCarrito(producto)}
              title={t("common.agregar_al_carrito")}
            >
              <FaShoppingCart />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
