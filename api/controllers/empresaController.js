const pool = require("../models/db");

// Obtener la empresa
const getEmpresa = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_empresa, nombre, ingles, razon_social, cif, direccion, codigo_postal, poblacion, provincia, pais, telefono, email, web, logo, firma_factura, texto_footer, texto_footer_ingles, slogan, slogan_ingles, fecha_alta, activo FROM empresa WHERE id_empresa = 1'
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
      `SELECT 
        id_empresa_web,
        id_empresa,
        Welcome_title,
        Welcome_text,
        About_title,
        About_text,
        Customer_title,
        Customer_satisfied,
        Customer_appreciated,
        Contact_title,
        Contact_text,
        \`Welcome_title-Ingles\` as Welcome_title_ingles,
        \`Welcome_text-Ingles\` as Welcome_text_ingles,
        \`About_title-Ingles\` as About_title_ingles,
        \`About_text-Ingles\` as About_text_ingles,
        \`Customer_title-Ingles\` as Customer_title_ingles,
        \`Customer_satisfied-Ingles\` as Customer_satisfied_ingles,
        \`Customer_appreciated-Ingles\` as Customer_appreciated_ingles,
        \`Contact_title-Ingles\` as Contact_title_ingles,
        \`Contact_text-Ingles\` as Contact_text_ingles,
        url_image,
        all_category
      FROM empresa_web WHERE id_empresa = 1`
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