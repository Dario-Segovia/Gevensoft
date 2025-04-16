const express = require("express");
const cors = require("cors");

const productosRoutes = require("./routes/productosRoutes"); // o como tengas tus rutas

const app = express();

// 👇 Habilita CORS para permitir peticiones del frontend
app.use(cors());

// 👇 Parseo de JSON en las peticiones
app.use(express.json());

// 👇 Tus rutas de la API
app.use("/api", productosRoutes);

// 👇 Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
