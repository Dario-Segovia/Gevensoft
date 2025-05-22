import React, { useState } from "react";
import "./Variantes.css";

const baseURL = "http://localhost:3000";

const Variantes = ({ producto, varianteSeleccionada, onClose, onAgregar }) => {
  // Los hooks siempre van primero
  const [indiceVariante, setIndiceVariante] = useState(() => {
    if (producto && varianteSeleccionada) {
      const idx = producto.variantes.findIndex(
        (v) => String(v.id_variante) === String(varianteSeleccionada.id_variante)
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // Ahora sí, puedes retornar null si no hay producto
  if (!producto) return null;

  const varianteActual = producto.variantes[indiceVariante];

  const costeActual = parseFloat(
    varianteActual.Precio || varianteActual.Coste || varianteActual.cost || 0
  );

  // Imagen principal
  const imagenPrincipal =
    varianteActual.imagenes && varianteActual.imagenes.length > 0
      ? `${baseURL}${varianteActual.imagenes[0]}`
      : `${baseURL}/IMG/default.jpg`;

  return (
    <div className="modal-overlay">
      <div className="modal-content variante-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>{producto.Nombre}</h2>
        {/* Selector de variantes */}
        <div className="variante-selector">
          {producto.variantes.map((v, idx) => (
            <button
              key={v.id_variante}
              className={`variante-tab${
                idx === indiceVariante ? " active" : ""
              }`}
              onClick={() => setIndiceVariante(idx)}
            >
              {v.Nombre || producto.Nombre}
            </button>
          ))}
        </div>
        {/* Detalles de la variante */}
        <div className="variante-detalles">
          <img
            src={imagenPrincipal}
            alt={varianteActual.Nombre || producto.Nombre}
            className="variante-imagen"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${baseURL}/IMG/default.jpg`;
            }}
          />
          <div className="variante-info">
            <strong>
              {varianteActual.Nombre || producto.Nombre} -{" "}
              {costeActual.toFixed(2)} €
            </strong>
            {varianteActual.Descripcion && (
              <p className="variante-desc">{varianteActual.Descripcion}</p>
            )}
          </div>
        </div>
        <button
          className="add-main-variant"
          onClick={() => {
            onAgregar({
              ...producto,
              variante: varianteActual,
              id_item: producto.id_producto,
              tipo: "producto",
            });
            onClose(); // Cierra el modal después de añadir
          }}
        >
          Añadir esta variante al carrito
        </button>
      </div>
    </div>
  );
};

export default Variantes;
