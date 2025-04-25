const express = require("express");
const cors = require("cors");

const productosRoutes = require("./routes/productosRoutes"); // o como tengas tus rutas
const empresaRoute = require("./routes/empresaRoute"); // o como tengas tus rutas

const app = express();

// 👇 Habilita CORS para permitir peticiones del frontend
app.use(cors());

// 👇 Parseo de JSON en las peticiones
app.use(express.json());

// 👇 Tus rutas de la API
app.use("/api", productosRoutes);
app.use("/api", empresaRoute);

// 👇 Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
