const pool = require("../models/db");

const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_categoria, descripcion, ingles, id_padre, color_fondo, color_texto, tam_texto, orden, icono FROM categoria ORDER BY descripcion'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error en getCategorias:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getProductosPorCategoria = async (req, res) => {
  const { idCategoria } = req.params;

  if (!idCategoria || isNaN(idCategoria)) {
    return res.status(400).json({ error: "El idCategoria debe ser un número válido." });
  }

  try {
    const query = `
      SELECT DISTINCT
        p.id_producto, 
        p.Nombre, 
        p.DescipcionCorta, 
        p.DescripcionLarga, 
        p.Coste,
        p.\`N-Ingles\`,
        p.\`C-Inlges\`,
        p.\`L-Ingles\`,
        c.descripcion AS categoria,
        c.ingles AS categoria_ingles
      FROM producto p
      JOIN categoria_asociada ca ON p.id_producto = ca.id_producto
      JOIN categoria c ON ca.id_categoria = c.id_categoria
      LEFT JOIN variante v ON p.id_producto = v.id_producto
      WHERE ca.id_categoria = ?
      ORDER BY p.Nombre
    `;

    const [rows] = await pool.query(query, [parseInt(idCategoria, 10)]);
    res.json(rows);
  } catch (err) {
    console.error("Error en getProductosPorCategoria:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getProductos = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id_producto, 
        p.Nombre, 
        p.DescipcionCorta, 
        p.DescripcionLarga, 
        p.Coste,
        p.\`N-Ingles\`,
        p.\`C-Inlges\`,
        p.\`L-Ingles\`,

        v.id_variante,
        v.Nombre AS varianteNombre,
        v.Ingles AS varianteIngles,
        v.Precio,
        (p.Coste + v.Precio) AS PrecioCalculado,
        g.url_imagen,

        op.id_opcion,
        op.descripcion AS descripcion_opcion,
        op.ingles AS opcion_ingles

      FROM producto p
      LEFT JOIN variante v ON p.id_producto = v.id_producto
      LEFT JOIN galeria g ON v.id_variante = g.id_variante
      LEFT JOIN opciones_asociadas oa ON p.id_producto = oa.id_producto
      LEFT JOIN opcion_producto op ON oa.id_opcion = op.id_opcion

      ORDER BY p.Nombre, v.id_variante
    `;

    const [rows] = await pool.query(query);

    const productosMap = new Map();

    rows.forEach(row => {
      if (!productosMap.has(row.id_producto)) {
        productosMap.set(row.id_producto, {
          id_producto: row.id_producto,
          Nombre: row.Nombre,
          DescipcionCorta: row.DescipcionCorta,
          DescripcionLarga: row.DescripcionLarga,
          Coste: row.Coste,
          'N-Ingles': row['N-Ingles'],
          'C-Inlges': row['C-Inlges'],
          'L-Ingles': row['L-Ingles'],
          variantes: new Map(),
          opciones: new Map()
        });
      }

      const producto = productosMap.get(row.id_producto);

      // Procesar variantes
      if (row.id_variante && !producto.variantes.has(row.id_variante)) {
        producto.variantes.set(row.id_variante, {
          id_variante: row.id_variante,
          Nombre: row.varianteNombre,
          Ingles: row.varianteIngles,
          Precio: row.Precio,
          PrecioCalculado: row.PrecioCalculado,
          imagenes: []
        });
      }

      if (row.url_imagen && row.id_variante) {
        const variante = producto.variantes.get(row.id_variante);
        if (!variante.imagenes.includes(row.url_imagen)) {
          variante.imagenes.push(row.url_imagen);
        }
      }

      // Procesar opciones asociadas
      if (row.id_opcion && !producto.opciones.has(row.id_opcion)) {
        producto.opciones.set(row.id_opcion, {
          id_opcion: row.id_opcion,
          descripcion: row.descripcion_opcion,
          ingles: row.opcion_ingles
        });
      }
    });

    // Convertir mapas a arrays
    const productos = Array.from(productosMap.values()).map(producto => ({
      id_producto: producto.id_producto,
      Nombre: producto.Nombre,
      DescipcionCorta: producto.DescipcionCorta,
      DescripcionLarga: producto.DescripcionLarga,
      Coste: producto.Coste,
      'N-Ingles': producto['N-Ingles'],
      'C-Inlges': producto['C-Inlges'],
      'L-Ingles': producto['L-Ingles'],
      variantes: Array.from(producto.variantes.values()),
      opciones: Array.from(producto.opciones.values())
    }));

    res.json(productos);

  } catch (err) {
    console.error("Error en getProductos:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCategorias,
  getProductosPorCategoria,
  getProductos
};