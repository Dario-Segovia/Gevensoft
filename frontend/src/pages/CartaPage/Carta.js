import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ProductList from "./ProductList";

function Carta() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [allProductos, setAllProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCategoriasAndProductos = async () => {
      try {
        setLoading(true);
        
        const categoriasResponse = await fetch("http://localhost:3000/api/categorias");
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);
        
        const productosResponse = await fetch("http://localhost:3000/api/productos");
        const productosData = await productosResponse.json();
        setProductos(productosData);
        setAllProductos(productosData);

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

    if (idCategoria === categoriaSeleccionada) {
      setProductos(allProductos);
      setCategoriaSeleccionada(null);
      return;
    }

    setCategoriaSeleccionada(idCategoria);
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/productos/categoria/${idCategoria}`);
      const productosData = await response.json();
      
      const productosConVariantes = productosData.map(producto => {
        const productoCompleto = allProductos.find(p => p.id_producto === producto.id_producto);
        return productoCompleto ? { ...producto, variantes: productoCompleto.variantes } : producto;
      });
      
      setProductos(productosConVariantes);
    } catch (error) {
      console.error("Error cargando productos por categoría:", error);
      setProductos(allProductos);
    } finally {
      setLoading(false);
    }
  };

  const handleMostrarTodos = () => {
    setProductos(allProductos);
    setCategoriaSeleccionada(null);
  };

  return (
    <div className="app-container">
      <Sidebar 
        categorias={categorias} 
        onClickCategoria={handleCategoriaClick}
        categoriaSeleccionada={categoriaSeleccionada}
        onMostrarTodos={handleMostrarTodos}
      />
      <ProductList productos={productos} loading={loading} />
    </div>
  );
}

export default Carta;