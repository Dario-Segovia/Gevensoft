const pool = require("../models/db");

const getEmpresa = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "empresa" WHERE id_empresa = 1'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getEmpresa
};