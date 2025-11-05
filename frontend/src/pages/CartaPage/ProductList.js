import React, { useState, useEffect, useCallback, useMemo } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "./ProductList.css";
import debounce from "lodash.debounce";
import { FaShoppingCart, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { useCart } from "../../components/CartContext.jsx";
import Variantes from "../VariantesPage/Variantes";

const baseURL = "http://localhost:3000";

const ProductList = ({ productos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sliderValue, setSliderValue] = useState([0, 100]);
  const [sliderMax, setSliderMax] = useState(100); // Nuevo estado para el máximo dinámico
  const [modalProducto, setModalProducto] = useState(null);
  const [imageErrors, setImageErrors] = useState(new Set());

  const { agregarAlCarrito } = useCart();
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';

  // Mejor detección de datos disponibles
  const hasData = useMemo(() => {
    return productos && 
           Array.isArray(productos) && 
           productos.length > 0 && 
           productos.some(p => p && p.id_producto && p.Nombre);
  }, [productos]);

  // Productos de demostración
  const demoProducts = useMemo(() => [
    {
      id_producto: 'demo-1',
      Nombre: currentLanguage === 'en' ? 'Sample Product 1' : 'Producto de Ejemplo 1',
      'N-Ingles': 'Sample Product 1',
      DescipcionCorta: currentLanguage === 'en' 
        ? 'This is a sample product description' 
        : 'Esta es una descripción de producto de ejemplo',
      'C-Inlges': 'This is a sample product description',
      Coste: 25.99,
      isDemo: true
    },
    {
      id_producto: 'demo-2',
      Nombre: currentLanguage === 'en' ? 'Sample Product 2' : 'Producto de Ejemplo 2',
      'N-Ingles': 'Sample Product 2',
      DescipcionCorta: currentLanguage === 'en' 
        ? 'Another sample product for demonstration' 
        : 'Otro producto de ejemplo para demostración',
      'C-Inlges': 'Another sample product for demonstration',
      Coste: 39.99,
      isDemo: true
    },
    {
      id_producto: 'demo-3',
      Nombre: currentLanguage === 'en' ? 'Premium Product' : 'Producto Premium',
      'N-Ingles': 'Premium Product',
      DescipcionCorta: currentLanguage === 'en' 
        ? 'High quality premium product sample' 
        : 'Producto premium de alta calidad de ejemplo',
      'C-Inlges': 'High quality premium product sample',
      Coste: 79.99,
      isDemo: true
    }
  ], [currentLanguage]);

  useEffect(() => {
    // Configurar el rango de precios basado en los productos disponibles
    const productsToUse = hasData ? productos : demoProducts;
    const precios = productsToUse
      .map((p) => parseFloat(p.Coste || 0))
      .filter(p => !isNaN(p) && p > 0);
    
    if (precios.length > 0) {
      const min = Math.max(0, Math.floor(Math.min(...precios)));
      const max = Math.ceil(Math.max(...precios));
      const calculatedMax = Math.max(max, 100); // Asegurar mínimo 100
      
      setSliderMax(calculatedMax);
      setSliderValue([min, calculatedMax]);
      setPriceRange([min, calculatedMax]);
    } else {
      // Valores por defecto para productos demo
      setSliderMax(100);
      setSliderValue([0, 100]);
      setPriceRange([0, 100]);
    }
  }, [productos, demoProducts, hasData]);

  const productosConPrimeraVariante = useMemo(() => {
    if (hasData) {
      return Object.values(
        productos.reduce((acc, producto) => {
          if (producto && producto.id_producto) {
            const id = producto.id_producto;
            if (!acc[id]) {
              acc[id] = producto;
            }
          }
          return acc;
        }, {})
      );
    } else {
      return demoProducts;
    }
  }, [productos, demoProducts, hasData]);

  // Resto del código se mantiene igual...
  // Función para obtener el nombre del producto según el idioma
  const getProductName = (producto) => {
    if (currentLanguage === 'en' && producto['N-Ingles']) {
      return producto['N-Ingles'];
    }
    return producto.Nombre || (currentLanguage === 'en' ? 'Unnamed Product' : 'Producto sin nombre');
  };

  // Función para obtener la descripción según el idioma
  const getProductDescription = (producto) => {
    if (currentLanguage === 'en' && producto['C-Inlges']) {
      return producto['C-Inlges'];
    }
    return producto.DescipcionCorta || (currentLanguage === 'en' 
      ? 'No description available' 
      : 'Descripción no disponible');
  };

  // Función para construir la URL de la imagen
  const getImagenProducto = useCallback((producto) => {
    // Para productos de demo, usar imagen por defecto
    if (producto.isDemo) {
      return `${baseURL}/IMG/default.jpg`;
    }

    const primeraVariante = producto.variantes && producto.variantes.length > 0
      ? producto.variantes[0]
      : null;

    if (imageErrors.has(producto.id_producto)) {
      return `${baseURL}/IMG/default.jpg`;
    }

    if (!primeraVariante?.imagenes?.[0]) {
      return `${baseURL}/IMG/default.jpg`;
    }

    const imagenVariante = primeraVariante.imagenes[0];
    
    if (imagenVariante.startsWith('http')) {
      return imagenVariante;
    }
    
    if (imagenVariante.startsWith('/')) {
      return `${baseURL}${imagenVariante}`;
    }
    
    return `${baseURL}/${imagenVariante}`;
  }, [imageErrors]);

  // Handler para errores de imagen
  const handleImageError = useCallback((productoId, e) => {
    console.warn('Error cargando imagen del producto:', productoId, e.target.src);
    
    if (e.target.src !== `${baseURL}/IMG/default.jpg`) {
      setImageErrors(prev => new Set(prev).add(productoId));
      e.target.src = `${baseURL}/IMG/default.jpg`;
    } else {
      e.target.onerror = null;
      console.error('No se pudo cargar la imagen por defecto para el producto:', productoId);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return productosConPrimeraVariante.filter((producto) => {
      if (!producto) return false;
      const productName = getProductName(producto);
      const searchTermLower = String(searchTerm || "").toLowerCase();
      const productCost = Number(producto.Coste) || 0;
      return (
        productName.toLowerCase().includes(searchTermLower) &&
        productCost >= priceRange[0] &&
        productCost <= priceRange[1]
      );
    });
  }, [productosConPrimeraVariante, searchTerm, priceRange]);

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
    if (item.isDemo) {
      alert(currentLanguage === 'en' 
        ? 'This is a demo product. Real products will be available soon.' 
        : 'Este es un producto de demostración. Los productos reales estarán disponibles pronto.');
      return;
    }
    agregarAlCarrito(item);
  };

  // Textos según idioma
  const texts = {
    buscarProducto: currentLanguage === 'en' ? 'Search product...' : 'Buscar producto...',
    rangoPrecio: currentLanguage === 'en' ? 'Price range:' : 'Rango de precio:',
    agregarAlCarrito: currentLanguage === 'en' ? 'Add to cart' : 'Agregar al carrito',
    productosNoDisponibles: currentLanguage === 'en' 
      ? 'Products not available at the moment' 
      : 'Productos no disponibles en este momento',
    mostrandoProductosDemo: currentLanguage === 'en' 
      ? 'Showing demo products' 
      : 'Mostrando productos de demostración',
    productoDemo: currentLanguage === 'en' ? 'Demo Product' : 'Producto Demo'
  };

  return (
    <div className="product-list-container">
      <div className="filters-container">
        <input
          type="text"
          placeholder={texts.buscarProducto}
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="price-filter">
          <label>
            {texts.rangoPrecio} {sliderValue[0].toFixed(2)} € -{" "}
            {sliderValue[1].toFixed(2)} €
          </label>
          {/* Ahora usa el máximo dinámico */}
          <RangeSlider
            min={0}
            max={sliderMax}
            step={0.01}
            value={sliderValue}
            onInput={handleSliderChange}
          />
        </div>

        {!hasData && (
          <div className="demo-warning">
            <FaExclamationTriangle />
            <span>{texts.mostrandoProductosDemo}</span>
          </div>
        )}
      </div>

      <div className="product-list">
        {filteredProducts.map((producto) => {
          const productName = getProductName(producto);
          const productDescription = getProductDescription(producto);
          const imagenProducto = getImagenProducto(producto);
          const isDemoProduct = producto.isDemo;

          return (
            <div key={producto.id_producto} className={`product-card ${isDemoProduct ? 'demo-product' : ''}`}>
              {isDemoProduct && (
                <div className="demo-badge">
                  <FaInfoCircle />
                  <span>{texts.productoDemo}</span>
                </div>
              )}
              
              <div className="product-image-container">
                <img
                  src={imagenProducto}
                  alt={productName}
                  className="product-image"
                  onError={(e) => handleImageError(producto.id_producto, e)}
                />
              </div>

              <div className="product-info">
                <h3 className="product-name">{productName}</h3>
                <p className="product-description">{productDescription}</p>
                <p className="product-cost">
                  {parseFloat(producto.Coste || 0).toFixed(2)} €
                </p>
              </div>

              <button
                className={`add-to-cart-button ${isDemoProduct ? 'demo-button' : ''}`}
                onClick={() => {
                  if (isDemoProduct) {
                    agregarYCerrar(producto);
                    return;
                  }

                  if (producto.variantes && producto.variantes.length === 1) {
                    agregarAlCarrito({
                      id_producto: producto.id_producto,
                      id_item: producto.id_producto,
                      tipo: "producto",
                      Nombre: productName,
                      descripcion: productDescription,
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
                      Nombre: productName,
                      descripcion: productDescription,
                      cantidad: 1,
                      Coste: parseFloat(producto.Coste ?? 0)
                    });
                  }
                }}
                title={texts.agregarAlCarrito}
              >
                <FaShoppingCart />
              </button>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="no-products-message">
            <FaExclamationTriangle />
            <h3>{texts.productosNoDisponibles}</h3>
            <p>
              {currentLanguage === 'en' 
                ? 'Try adjusting your search criteria or check back later.' 
                : 'Intenta ajustar tus criterios de búsqueda o vuelve más tarde.'}
            </p>
          </div>
        )}
      </div>

      {modalProducto && (
        <Variantes
          producto={modalProducto}
          onClose={() => setModalProducto(null)}
          onAgregar={(item) => {
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