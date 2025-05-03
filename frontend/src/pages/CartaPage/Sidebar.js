// src/components/Sidebar.js
import React, { useState } from "react";
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

const CategoryItem = ({ category, onClickCategoria, isParent }) => {
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
        <span>{category.Descripcion}</span>
        
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
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ categorias, onClickCategoria }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const categoryTree = buildCategoryTree(categorias);

  return (
    <aside className="sidebar">
      <h2>Categorías</h2>
      <ul>
        {categoryTree.map(category => (
          <CategoryItem
            key={category.id_categoria}
            category={category}
            onClickCategoria={onClickCategoria}
            isParent={category.children.length > 0}
          />
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;