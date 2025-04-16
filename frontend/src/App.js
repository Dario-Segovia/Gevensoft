// src/App.js
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ProductList from "./components/ProductList";
import "./App.css";

function App() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error cargando categorías:", err));
  }, []);

  const handleCategoriaClick = (idCategoria) => {
    if (!idCategoria || isNaN(idCategoria)) {
      console.error("ID de categoría no válido.");
      return;
    }
  
    setCategoriaSeleccionada(idCategoria);
    fetch(`http://localhost:3000/api/productos/categoria/${idCategoria}`)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  };
  

  return (
    <div className="app-container">
      <Sidebar categorias={categorias} onClickCategoria={handleCategoriaClick} />
      <main className="main-content">
        <h2>Productos</h2>
        <ProductList productos={productos} />
      </main>
    </div>
  );
}

export default App;
