const pool = require("../models/db");

const getCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categoria ORDER BY descripcion');
    res.json(rows); // MySQL devuelve un array como [rows, fields]
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
        c.descripcion AS categoria
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
        v.id_variante,
        v.Nombre AS varianteNombre,
        v.Precio,
        (p.Coste + v.Precio) AS PrecioCalculado,
        g.url_imagen
      FROM producto p
      LEFT JOIN variante v ON p.id_producto = v.id_producto
      LEFT JOIN galeria g ON v.id_variante = g.id_variante
      ORDER BY p.Nombre, v.id_variante
    `;

    const [rows] = await pool.query(query);

    const productosMap = new Map();

    rows.forEach(row => {
      if (!row.id_variante) return;

      if (!productosMap.has(row.id_producto)) {
        productosMap.set(row.id_producto, {
          id_producto: row.id_producto,
          Nombre: row.Nombre,
          DescipcionCorta: row.DescipcionCorta,
          DescripcionLarga: row.DescripcionLarga,
          Coste: row.Coste,
          variantes: new Map()
        });
      }

      const producto = productosMap.get(row.id_producto);

      if (!producto.variantes.has(row.id_variante)) {
        producto.variantes.set(row.id_variante, {
          id_variante: row.id_variante,
          Nombre: row.varianteNombre,    // Aquí asignamos el nombre de la variante
          Precio: row.Precio,
          PrecioCalculado: row.PrecioCalculado,
          imagenes: []
        });
      }

      const variante = producto.variantes.get(row.id_variante);

      if (row.url_imagen && !variante.imagenes.includes(row.url_imagen)) {
        variante.imagenes.push(row.url_imagen);
      }
    });

    const productos = Array.from(productosMap.values()).map(producto => ({
      id_producto: producto.id_producto,
      Nombre: producto.Nombre,
      DescipcionCorta: producto.DescipcionCorta,
      DescripcionLarga: producto.DescripcionLarga,
      Coste: producto.Coste,
      variantes: Array.from(producto.variantes.values())
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
