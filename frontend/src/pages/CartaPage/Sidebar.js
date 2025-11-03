import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "./Sidebar.css";

// Función para verificar si la imagen existe
const checkImageExists = async (url) => {
  if (!url) return false;
  
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
};

// Hook personalizado para manejar imágenes de categoría
const useCategoryIcon = (category) => {
  const [iconUrl, setIconUrl] = useState('/categorias/default.jpg');
  
  useEffect(() => {
    const verifyImage = async () => {
      // Verificar imagen de la API primero
      const apiIconUrl = category.Url_icono || category.icono || category.icon_url;
      
      if (apiIconUrl && await checkImageExists(apiIconUrl)) {
        setIconUrl(apiIconUrl);
        return;
      }
      
      // Fallback a imagen local
      const localIconUrl = `/default.jpg`;
      const localExists = await checkImageExists(localIconUrl);
      setIconUrl(localExists ? localIconUrl : '/default.jpg');
    };
    
    verifyImage();
  }, [category.Url_icono, category.icono, category.icon_url]);
  
  return iconUrl;
};

// Función auxiliar para construir nombres de propiedades consistentes
const getCategoryIcon = (category) => {
  return category.Url_icono || category.icono || category.icon_url || null;
};

const buildCategoryTree = (categories) => {
  const categoryMap = {};
  const rootCategories = [];
  
  categories.forEach(category => {
    categoryMap[category.id_categoria] = { 
      ...category, 
      children: [],
      isExpanded: false,
      Url_icono: getCategoryIcon(category)
    };
  });
  
  categories.forEach(category => {
    if (category.id_padre && categoryMap[category.id_padre]) {
      categoryMap[category.id_padre].children.push(categoryMap[category.id_categoria]);
    } else if (!category.id_padre) {
      rootCategories.push(categoryMap[category.id_categoria]);
    }
  });
  
  return rootCategories;
};

// Función auxiliar para obtener texto traducido
const getTranslatedCategoryName = (category, t) => {
  const description = category.descripcion?.toLowerCase?.() || 'sin_categoria';
  const translationKey = `categoria.${description}`;
  const translated = t(translationKey);
  
  // Si la traducción devuelve la misma clave, usar la descripción original
  return translated === translationKey ? category.descripcion : translated;
};

const CategoryItem = React.memo(({ category, onClickCategoria, isParent, t }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const iconUrl = useCategoryIcon(category);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    if (isParent) {
      setIsExpanded(prev => !prev);
    }
  }, [isParent]);

  const handleCategoryClick = useCallback(() => {
    if (!isParent && onClickCategoria) {
      onClickCategoria(category.id_categoria);
    }
  }, [isParent, onClickCategoria, category.id_categoria]);

  const displayName = getTranslatedCategoryName(category, t);
  
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
            if (e.target.src !== '/default.jpg') {
              e.target.src = '/default.jpg';
            }
          }} 
        />
        <span>{displayName}</span>
        
        {isParent && (
          <span 
            className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggle}
          >
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      
      {isParent && isExpanded && category.children.length > 0 && (
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
});

const Sidebar = ({ categorias, onClickCategoria }) => {
  const { t } = useTranslation();
  
  const categoryTree = useMemo(() => {
    if (categorias && categorias.length > 0) {
      return buildCategoryTree(categorias);
    }
    return [];
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