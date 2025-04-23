const pool = require("../models/db");

const getCategorias = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "Categoria" ORDER BY "Descripcion"'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductosPorCategoria = async (req, res) => {
  const { idCategoria } = req.params;

  console.log("idCategoria recibido:", idCategoria);

  // Validar que idCategoria sea un número
  if (!idCategoria || isNaN(idCategoria)) {
    return res.status(400).json({ error: "El idCategoria debe ser un número válido." });
  }

  try {
    const query = `
SELECT *
FROM (
    SELECT DISTINCT ON (p.id_producto)
        p.id_producto, 
        p."Nombre", 
        p."DescripcionCorta", 
        p."DescripcionLarga", 
        p."Coste",
        g."Url_imagen"
    FROM "Producto" p
    JOIN "Categoria_asociada" ca ON p.id_producto = ca.id_producto
    LEFT JOIN "Variante" v ON p.id_producto = v.id_producto
    LEFT JOIN "Galeria" g ON v.id_variante = g.id_variante
    WHERE ca.id_categoria = $1
    ORDER BY p.id_producto, g."id_galeria" DESC  -- Ordena para seleccionar la imagen más reciente
) AS subconsulta
ORDER BY "Nombre"
    `;
    
    const result = await pool.query(query, [parseInt(idCategoria, 10)]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error ejecutando la consulta:", err.message);
    res.status(500).json({ error: err.message });
  }
};


const getProductosMasPedidos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.idproducto, p.nombre, p.descripcion, p.precio, SUM(dp.cantidad) AS total_pedidos
      FROM detallepedido dp
      JOIN producto p ON dp.idproducto = p.idproducto
      GROUP BY p.idproducto
      ORDER BY total_pedidos DESC
      LIMIT 10;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCategorias,
  getProductosPorCategoria,
  getProductosMasPedidos,
};
