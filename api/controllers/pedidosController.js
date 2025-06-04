const pool = require("../models/db");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Obtener todos los pedidos (sin contenido)
const getPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pedido ORDER BY fecha_pedido DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error en getPedidos:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Obtener un pedido por ID, incluyendo su contenido
const getPedidoPorId = async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "El id debe ser un número válido." });
  }
  try {
    const [[pedido]] = await pool.query("SELECT * FROM pedido WHERE id_pedido = ?", [id]);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado." });

    const [contenido] = await pool.query(
      `SELECT cp.*, v.Nombre AS varianteNombre
       FROM contenido_pedido cp
       LEFT JOIN variante v ON cp.id_variante = v.id_variante
       WHERE cp.id_pedido = ?`, [id]
    );
    pedido.contenido = contenido;
    res.json(pedido);
  } catch (err) {
    console.error("Error en getPedidoPorId:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Crear un nuevo pedido con su contenido
const crearPedido = async (req, res) => {
  let {
    id_cliente,
    estado,
    total,
    direccion_envio,
    codigo_postal_envio,
    poblacion_envio,
    provincia_envio,
    pais_envio,
    metodo_pago,
    notas,
    contenido // Array de items
  } = req.body;

  estado = estado || "pendiente";
  metodo_pago = metodo_pago || "efectivo";
  notas = notas || null;

  if (!id_cliente || !Array.isArray(contenido) || contenido.length === 0) {
    return res.status(400).json({ error: "Datos de pedido incompletos." });
  }

  const conn = await pool.getConnection();

  try {
    if (!direccion_envio || !codigo_postal_envio || !poblacion_envio || !provincia_envio || !pais_envio) {
      const [clienteRows] = await pool.query(
        "SELECT direccion, codigo_postal, poblacion, provincia, pais FROM cliente WHERE id_cliente = ?",
        [id_cliente]
      );

      if (clienteRows.length === 0) {
        conn.release();
        return res.status(404).json({ error: "Cliente no encontrado para completar dirección." });
      }

      const cliente = clienteRows[0];

      direccion_envio = direccion_envio || cliente.direccion;
      codigo_postal_envio = codigo_postal_envio || cliente.codigo_postal;
      poblacion_envio = poblacion_envio || cliente.poblacion;
      provincia_envio = provincia_envio || cliente.provincia;
      pais_envio = pais_envio || cliente.pais;
    }

    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO pedido
      (id_cliente, estado, total, direccion_envio, codigo_postal_envio, poblacion_envio, provincia_envio, pais_envio, metodo_pago, notas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_cliente,
        estado,
        total,
        direccion_envio,
        codigo_postal_envio,
        poblacion_envio,
        provincia_envio,
        pais_envio,
        metodo_pago,
        notas
      ]
    );

    const id_pedido = result.insertId;

    for (const item of contenido) {
      await conn.query(
        `INSERT INTO contenido_pedido
        (id_pedido, id_variante, cantidad, precio_unitario, descuento, notas)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id_pedido,
          item.id_variante,
          item.cantidad || 1,
          item.precio_unitario,
          item.descuento || 0,
          item.notas || null
        ]
      );
    }

    await conn.commit();
    res.status(201).json({ id_pedido }); // RESPUESTA ÚNICA AQUÍ

    // --- Lógica de correo en background ---
    (async () => {
      try {
        const [clienteRows] = await pool.query("SELECT email, nombre FROM cliente WHERE id_cliente = ?", [id_cliente]);
        if (!clienteRows.length) {
          console.error("Cliente no encontrado para email");
          return;
        }
        const cliente = clienteRows[0];

        const rutaBaseImagenes = path.resolve(__dirname, "../../frontend/public");
        let html = `
          <h1>Gracias por tu pedido, ${cliente.nombre}</h1>
          <h2>Resumen de tu pedido #${id_pedido}</h2>
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
        `;

        const attachments = [];

        for (const [index, item] of contenido.entries()) {
          const [[variante]] = await pool.query(
            `SELECT v.Nombre, v.Precio, g.url_imagen
             FROM variante v
             LEFT JOIN galeria g ON v.id_variante = g.id_variante
             WHERE v.id_variante = ? LIMIT 1`, [item.id_variante]
          );

          if (!variante) continue;

          const nombreArchivo = variante.url_imagen ? path.basename(variante.url_imagen) : null;
          let rutaImagenLocal = null;

          if (nombreArchivo) {
            rutaImagenLocal = path.join(
              rutaBaseImagenes,
              "IMG",
              item.id_variante.toString(),
              nombreArchivo
            );
          }

          const opcionTexto = item.opcion?.descripcion
            ? `<p><strong>Opción:</strong> ${item.opcion.descripcion}</p>`
            : "";

          if (rutaImagenLocal && fs.existsSync(rutaImagenLocal)) {
            const cid = `imagen_${id_pedido}_${index}@gevensoft`;

            attachments.push({
              filename: nombreArchivo,
              path: rutaImagenLocal,
              cid: cid,
              contentDisposition: "inline"
            });

            html += `
              <div style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px; display: flex;">
                <img src="cid:${cid}" alt="${variante.Nombre}" style="max-width: 100px; max-height: 100px; margin-right: 15px;"/>
                <div>
                  <h3 style="margin-top: 0;">${variante.Nombre}</h3>
                  ${opcionTexto}
                  <p>Precio unitario: ${item.precio_unitario} €</p>
                  <p>Cantidad: ${item.cantidad}</p>
                  <p>Subtotal: ${(item.precio_unitario * item.cantidad).toFixed(2)} €</p>
                </div>
              </div>
            `;
          } else {
            html += `
              <div style="margin: 20px 0; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
                <h3 style="margin-top: 0;">${variante.Nombre}</h3>
                ${opcionTexto}
                <p>Precio unitario: ${item.precio_unitario} €</p>
                <p>Cantidad: ${item.cantidad}</p>
                <p>Subtotal: ${(item.precio_unitario * item.cantidad).toFixed(2)} €</p>
              </div>
            `;
          }
        }

        html += `
            <div style="margin-top: 20px; font-size: 1.2em;">
              <strong>Total del pedido: ${total} €</strong>
            </div>
          </div>
          <p style="margin-top: 30px; color: #666;">
            Gracias por confiar en nosotros. Tu pedido está siendo procesado.
          </p>
        `;

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "",
            pass: "",
          },
        });

        const info = await transporter.sendMail({
          from: '"Gevensoft" <dario010904@gmail.com>',
          to: cliente.email,
          subject: `Confirmación de pedido #${id_pedido}`,
          html: html,
          attachments: attachments
        });

        console.log("Correo enviado:", info.messageId);
      } catch (emailErr) {
        console.error("Error al enviar correo:", emailErr);
      }
    })();

  } catch (err) {
    await conn.rollback();
    console.error("Error en crearPedido:", err.message);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

module.exports = {
  getPedidos,
  getPedidoPorId,
  crearPedido
};
