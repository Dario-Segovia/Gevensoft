import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";


function Carta() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategoriasAndProductos = async () => {
      try {
        setLoading(true);
        
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

        const productosResponse = await fetch("http://localhost:3000/api/productos");
        const productosData = await productosResponse.json();
        setProductos(productosData);

      } catch (error) {
        console.error("Error cargando categorías o productos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoriasAndProductos();
  }, []);

  const handleCategoriaClick = async (idCategoria) => {
    if (!idCategoria || isNaN(idCategoria)) {
      console.error("ID de categoría no válido.");
      return;
    }

    if (idCategoria === categoriaSeleccionada) return;

    setCategoriaSeleccionada(idCategoria);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/productos/categoria/${idCategoria}`);
      const productosData = await response.json();
      setProductos(productosData);
    } catch (error) {
      console.error("Error cargando productos por categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar categorias={categorias} onClickCategoria={handleCategoriaClick} />
      <ProductList productos={productos} loading={loading} />
    </div>
  );
}

export default Carta;



