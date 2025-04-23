import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/ProductList";

import "./App.css";

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  useEffect(() => {
    const loadCategoriasAndProductos = async () => {
      try {
        // Marcar como cargando
        setLoading(true);

        // Cargar categorías
        const categoriasResponse = await fetch("http://localhost:3000/api/categorias");
        const categoriasData = await categoriasResponse.json();

        const categoriasConIconos = categoriasData.map((cat) => {
          let icono = "";

          switch (cat.Descripcion) {
            case "Entrantes":
              icono = "categorias/entrantes.png";
              break;
            case "Panes":
              icono = "categorias/panes.png";
              break;
            case "Pastas":
              icono = "categorias/pastas.png";
              break;
            case "Pizzas":
              icono = "categorias/pizzas.png";
              break;
            case "Bebidas":
              icono = "categorias/bebidas.png";
              break;
            default:
              icono = "/img/default.png";
              break;
          }

          return { ...cat, icono };
        });

        setCategorias(categoriasConIconos);

        // Cargar productos solo una vez, después de las categorías
        const productosResponse = await fetch("http://localhost:3000/api/productos");
        const productosData = await productosResponse.json();
        setProductos(productosData);

      } catch (error) {
        console.error("Error cargando categorías o productos:", error);
      } finally {
        // Terminar la carga
        setLoading(false);
      }
    };

    loadCategoriasAndProductos();
  }, []); // Solo se ejecuta una vez

  const handleCategoriaClick = async (idCategoria) => {
    if (!idCategoria || isNaN(idCategoria)) {
      console.error("ID de categoría no válido.");
      return;
    }

    // Evitar hacer la misma solicitud si la categoría ya está seleccionada
    if (idCategoria === categoriaSeleccionada) return;

    setCategoriaSeleccionada(idCategoria);
    setLoading(true); // Marcar como cargando productos por categoría

    try {
      const response = await fetch(`http://localhost:3000/api/productos/categoria/${idCategoria}`);
      const productosData = await response.json();
      setProductos(productosData);
    } catch (error) {
      console.error("Error cargando productos por categoría:", error);
    } finally {
      setLoading(false); // Terminar la carga
    }
  };

  return (
    <div className="app-container">
      {/* Cabecera fija arriba */}
      <Header />
      <div className="main-content">
        {/* Sidebar con categorías a la izquierda */}
        <Sidebar categorias={categorias} onClickCategoria={handleCategoriaClick} />
        {/* ProductList a la derecha del Sidebar */}
        <ProductList productos={productos} loading={loading} />
      </div>
    </div>
  );
}

export default App;
