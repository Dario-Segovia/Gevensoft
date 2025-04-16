// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ categorias, onClickCategoria }) => {
  return (
    <aside className="sidebar">
      <h2>Categorías</h2>
      <ul>
        {categorias.map((cat) => (
          <li key={cat.id_categoria} onClick={() => onClickCategoria(cat.id_categoria)}>
            {cat.Descripcion}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
