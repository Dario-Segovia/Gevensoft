const pool = require("../models/db");

// Obtener la empresa
const getEmpresa = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM empresa WHERE id_empresa = 1'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error en getEmpresa:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Obtener la información de la empresa web
const getEmpresaWeb = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM empresa_web WHERE id_empresa = 1'
    );
    res.json(rows);
  } catch (err) {
    console.error("Error en getEmpresaWeb:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEmpresa,
  getEmpresaWeb
};
