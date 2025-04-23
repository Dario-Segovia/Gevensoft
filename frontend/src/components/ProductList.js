import React, { useState, useEffect, useCallback } from "react";
import RangeSlider from "react-range-slider-input"; // Importa la librería
import "react-range-slider-input/dist/style.css"; // Estilos de la librería
import "./ProductList.css"; // Asegúrate de que tienes el archivo CSS correspondiente
import debounce from 'lodash.debounce'; // Importa debounce

const ProductList = ({ productos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10]); // Rango de precio filtrado
  const [sliderValue, setSliderValue] = useState([0, 10]); // Valor visual del slider

  // Ajustar los rangos si los productos cambian
  useEffect(() => {
    if (productos.length > 0) {
      const precios = productos.map((p) => p.Coste);
      const min = Math.min(...precios);
      const max = Math.max(...precios);
      setSliderValue([min, max]);
      setPriceRange([min, max]);
    }
  }, [productos]);

  // Filtrar productos por nombre y rango de precio
  const filteredProducts = productos.filter(
    (producto) =>
      producto.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      producto.Coste >= priceRange[0] &&
      producto.Coste <= priceRange[1]
  );

  // Manejar la búsqueda de productos
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar el cambio del rango de precio visual (sliderValue)
  const handleSliderChange = (newPriceRange) => {
    setSliderValue(newPriceRange); // Solo actualizamos el valor visual
  };

  // Actualizar el estado de priceRange con debounce para el filtrado
  const handlePriceChange = useCallback(
    debounce((newPriceRange) => {
      setPriceRange(newPriceRange); // Solo se actualiza el rango filtrado
    }, 500), // Ajusta el tiempo de espera en milisegundos
    []
  );

  // Llamar a handlePriceChange cuando el slider se haya actualizado
  useEffect(() => {
    handlePriceChange(sliderValue);
  }, [sliderValue, handlePriceChange]);

  return (
    <div className="product-list-container">
      <div className="filters-container">
        {/* Filtro de búsqueda */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        {/* Filtro de precio */}
        <div className="price-filter">
          <label>
            Rango de precio: {sliderValue[0]} € - {sliderValue[1]} €
          </label>
          <RangeSlider
            min={0}
            max={10}
            step={1}
            value={sliderValue}
            onInput={handleSliderChange} // Actualiza solo el valor visual del slider
          />
        </div>
      </div>

      <div className="product-list">
        {filteredProducts.map((producto) => (
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
              <p className="product-description">{producto.DescripcionLarga}</p>
              <p className="product-cost">{producto.Coste} €</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
