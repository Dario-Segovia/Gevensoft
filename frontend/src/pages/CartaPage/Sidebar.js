// src/components/Sidebar.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Importa el hook para traducción
import "./Sidebar.css";

const buildCategoryTree = (categories) => {
  const categoryMap = {};
  const rootCategories = [];
  
  // Crear mapa de categorías
  categories.forEach(category => {
    categoryMap[category.id_categoria] = { 
      ...category, 
      children: [],
      isExpanded: false
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
  
  const handleToggle = (e) => {
    e.stopPropagation();
    if (isParent) {
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <li className={`sidebar-item ${isParent ? 'parent' : ''}`}>
      <div 
        className="category-content" 
        onClick={() => !isParent && onClickCategoria(category.id_categoria)}
      >
        <img 
          src={category.Url_icono} 
          alt={category.Descripcion} 
          className="icono-categoria" 
        />
        <span>{t(`categoria.${category.Descripcion.toLowerCase()}`)}</span> {/* Traducir el nombre de la categoría */}
        
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
              t={t} // Pasar la función de traducción
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ categorias, onClickCategoria }) => {
  const { t } = useTranslation(); // Usar el hook de traducción
  const [expandedCategories, setExpandedCategories] = useState({});
  const categoryTree = buildCategoryTree(categorias);

  return (
    <aside className="sidebar">
      <h2>{t("sidebar.categorias")}</h2> {/* Traducir el título */}
      <ul>
        {categoryTree.map(category => (
          <CategoryItem
            key={category.id_categoria}
            category={category}
            onClickCategoria={onClickCategoria}
            isParent={category.children.length > 0}
            t={t} // Pasar la función de traducción
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
