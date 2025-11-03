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
      const apiIconUrl = category.icono;
      
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
  }, [category.icono]);
  
  return iconUrl;
};

const buildCategoryTree = (categories) => {
  const categoryMap = {};
  const rootCategories = [];
  
  categories.forEach(category => {
    categoryMap[category.id_categoria] = { 
      ...category, 
      children: [],
      isExpanded: false
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

// Función auxiliar para obtener el nombre de la categoría según el idioma
const getCategoryName = (category, currentLanguage) => {
  // Si el idioma es inglés y existe la traducción, usar 'ingles'
  if (currentLanguage === 'en' && category.ingles) {
    return category.ingles;
  }
  // Por defecto usar 'descripcion'
  return category.descripcion || 'Sin categoría';
};

const CategoryItem = React.memo(({ category, onClickCategoria, isParent, currentLanguage }) => {
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

  const displayName = getCategoryName(category, currentLanguage);
  
  return (
    <li className={`sidebar-item ${isParent ? 'parent' : ''}`}>
      <div 
        className="category-content" 
        onClick={handleCategoryClick}
        style={{ cursor: isParent ? 'default' : 'pointer' }}
      >
        <img 
          src={iconUrl} 
          alt={displayName} 
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
              currentLanguage={currentLanguage}
            />
          ))}
        </ul>
      )}
    </li>
  );
});

const Sidebar = ({ categorias, onClickCategoria }) => {
  const currentLanguage = localStorage.getItem('i18nextLng') || 'es';
  
  const categoryTree = useMemo(() => {
    if (categorias && categorias.length > 0) {
      return buildCategoryTree(categorias);
    }
    return [];
  }, [categorias]);

  return (
    <aside className="sidebar">
      <h2>{currentLanguage === 'en' ? 'Categories' : 'Categorías'}</h2>
      <ul>
        {categoryTree.map(category => (
          <CategoryItem
            key={category.id_categoria}
            category={category}
            onClickCategoria={onClickCategoria}
            isParent={category.children.length > 0}
            currentLanguage={currentLanguage}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;