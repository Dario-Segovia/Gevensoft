const pool = require("../models/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Configura nodemailer con Gmail (usa app password, NO tu contraseña normal)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",       // Cambia por tu email
    pass: "",          // Cambia por tu app password
  },
});

const registerUser = async (req, res) => {
  const {
    nombre,
    apellidos,
    email,
    password,
    telefono,
    direccion,
    codigo_postal,
    poblacion,
    provincia,
    pais
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [existing] = await pool.query("SELECT * FROM cliente WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    const [result] = await pool.query(
      `INSERT INTO cliente (
        nombre, apellidos, email, password_hash, salt,
        telefono, direccion, codigo_postal, poblacion,
        provincia, pais, fecha_registro, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)`,
      [
        nombre,
        apellidos || null,
        email,
        password_hash,
        salt,
        telefono || null,
        direccion || null,
        codigo_postal || null,
        poblacion || null,
        provincia || null,
        pais || null
      ]
    );

    res.status(201).json({ message: "Usuario registrado correctamente", id: result.insertId });
  } catch (err) {
    console.error("Error en registerUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Inicio de sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    await pool.query("UPDATE cliente SET ultimo_login = NOW() WHERE id_cliente = ?", [user.id_cliente]);

    res.json({ message: "Inicio de sesión exitoso", user: { id: user.id_cliente, nombre: user.nombre, email: user.email } });
  } catch (err) {
    console.error("Error en loginUser:", err.message);
    res.status(500).json({ error: err.message });
  }
};
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const user = users[0];

    if (user.token_recuperacion !== token || new Date(user.expiracion_token) < new Date()) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await pool.query(
      "UPDATE cliente SET password_hash = ?, salt = ?, token_recuperacion = NULL, expiracion_token = NULL WHERE email = ?",
      [password_hash, salt, email]
    );

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (err) {
    console.error("Error en resetPassword:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Solicitar recuperación de contraseña con envío de email
const sendRecoveryToken = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "Correo no encontrado" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 3600 * 1000); // 1 hora desde ahora

    await pool.query(
      "UPDATE cliente SET token_recuperacion = ?, expiracion_token = ? WHERE email = ?",
      [token, expiration, email]
    );

    // Construir link de recuperación (ajusta el dominio/puerto a tu frontend)
    const resetLink = `http://localhost:3001/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    // Enviar correo con el token/link
    await transporter.sendMail({
      from: '"Soporte Gevensoft" <tuemail@gmail.com>',
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para restablecerla:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    res.json({ message: "Se ha enviado un token de recuperación al correo" });
  } catch (err) {
    console.error("Error en sendRecoveryToken:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendRecoveryToken,
  resetPassword,
};
