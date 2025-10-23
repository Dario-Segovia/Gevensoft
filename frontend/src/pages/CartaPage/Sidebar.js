import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";

// Función para verificar si la imagen existe
const checkImageExists = async (url) => {
  // Si no hay URL, retornamos false inmediatamente
  if (!url) return false;
  
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
};

const buildCategoryTree = (categories) => {
  const categoryMap = {};
  const rootCategories = [];
  
  // Crear mapa de categorías - USAMOS LA URL DE LA API DIRECTAMENTE
  categories.forEach(category => {
    categoryMap[category.id_categoria] = { 
      ...category, 
      children: [],
      isExpanded: false,
      // Usamos la URL del icono que viene de la API
      // Asegúrate de que el nombre de la propiedad coincida con tu API
      Url_icono: category.Url_icono || category.icono || category.icon_url || null
    };
  });
  
  // Construir árbol
  categories.forEach(category => {
    if (category.id_padre) {
      const parent = categoryMap[category.id_padre];
      if (parent) {
        parent.children.push(categoryMap[category.id_categoria]);
      }
    } else {
      rootCategories.push(categoryMap[category.id_categoria]);
    }
  });
  
  return rootCategories;
};

const CategoryItem = ({ category, onClickCategoria, isParent, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [iconUrl, setIconUrl] = useState('/categorias/default.jpg');
  
  // Verificar si la imagen existe al montar el componente
  useEffect(() => {
    const verifyImage = async () => {
      // Primero verificamos si la imagen de la API existe
      if (category.Url_icono) {
        const exists = await checkImageExists(category.Url_icono);
        if (exists) {
          setIconUrl(category.Url_icono);
          return;
        }
      }
      
      // Si no existe la imagen de la API, intentamos con la ruta local basada en ID
      const localIconUrl = `/categorias/${category.id_categoria}.jpg`;
      const localExists = await checkImageExists(localIconUrl);
      
      setIconUrl(localExists ? localIconUrl : '/categorias/default.jpg');
    };
    
    verifyImage();
  }, [category.Url_icono, category.id_categoria]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isParent) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleCategoryClick = () => {
    if (!isParent) {
      onClickCategoria(category.id_categoria);
    }
  };
  
  return (
    <li className={`sidebar-item ${isParent ? 'parent' : ''}`}>
      <div 
        className="category-content" 
        onClick={handleCategoryClick}
        style={{ cursor: isParent ? 'default' : 'pointer' }}
      >
        <img 
          src={iconUrl} 
          alt={category.Descripcion} 
          className="icono-categoria"
          onError={(e) => {
            e.target.src = '/categorias/default.jpg';
          }} 
        />
        <span>
          {t(`categoria.${category.descripcion?.toLowerCase?.() || 'sin_categoria'}`) === 
           `categoria.${category.descripcion?.toLowerCase?.()}` 
            ? category.descripcion 
            : t(`categoria.${category.descripcion?.toLowerCase?.() || 'sin_categoria'}`)
          }
        </span>
        
        {isParent && (
          <span 
            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggle}
          >
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      
      {isParent && isExpanded && (
        <ul className="nested-categories">
          {category.children.map(child => (
            <CategoryItem
              key={child.id_categoria}
              category={child}
              onClickCategoria={onClickCategoria}
              isParent={child.children.length > 0}
              t={t}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ categorias, onClickCategoria }) => {
  const { t } = useTranslation();
  const [categoryTree, setCategoryTree] = useState([]);

  // Construir el árbol de categorías
  useEffect(() => {
    if (categorias && categorias.length > 0) {
      setCategoryTree(buildCategoryTree(categorias));
    }
  }, [categorias]);

  return (
    <aside className="sidebar">
      <h2>{t("sidebar.categorias")}</h2>
      <ul>
        {categoryTree.map(category => (
          <CategoryItem
            key={category.id_categoria}
            category={category}
            onClickCategoria={onClickCategoria}
            isParent={category.children.length > 0}
            t={t}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;