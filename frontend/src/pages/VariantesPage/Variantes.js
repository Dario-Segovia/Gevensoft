import React, { useState } from "react";
import "./Variantes.css";

const baseURL = "http://localhost:3000";

const Variantes = ({ producto, varianteSeleccionada, onClose, onAgregar }) => {
  const [indiceVariante, setIndiceVariante] = useState(() => {
    if (producto && varianteSeleccionada) {
      const idx = producto.variantes.findIndex(
        (v) => String(v.id_variante) === String(varianteSeleccionada.id_variante)
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  // NUEVO: Estado para opción seleccionada
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(
    producto.opciones?.[0] || null
  );

  if (!producto) return null;

  const varianteActual = producto.variantes[indiceVariante];

  const costeActual = parseFloat(
    varianteActual.Precio || varianteActual.Coste || varianteActual.cost || 0
  );

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

        {/* Selector de opciones asociadas (nuevo) */}
        {producto.opciones?.length > 0 && (
          <div className="opcion-selector">
            <h4>Selecciona una opción:</h4>
            <select
              value={opcionSeleccionada?.id_opcion || ""}
              onChange={(e) => {
                const selected = producto.opciones.find(
                  (opt) => String(opt.id_opcion) === e.target.value
                );
                setOpcionSeleccionada(selected || null);
              }}
            >
              {producto.opciones.map((opt) => (
                <option key={opt.id_opcion} value={opt.id_opcion}>
                  {opt.descripcion}
                </option>
              ))}
            </select>
          </div>
        )}

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
              opcion: opcionSeleccionada, // <-- AÑADIDO
              id_item: producto.id_producto,
              tipo: "producto"
            });
            onClose();
          }}
        >
          Añadir esta variante al carrito
        </button>
      </div>
    </div>
  );
};

export default Variantes;
