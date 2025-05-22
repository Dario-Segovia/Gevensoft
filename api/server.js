const express = require("express");
const cors = require("cors");
const path = require("path");

const productosRoutes = require("./routes/productosRoutes"); 
const empresaRoute = require("./routes/empresaRoute"); 

const app = express();

// Habilita CORS para permitir peticiones del frontend
app.use(cors());

// Parseo de JSON en las peticiones
app.use(express.json());

// Servir imágenes desde la carpeta public/IMG
app.use('/IMG', express.static(path.join(__dirname, '../frontend/public/IMG')));

// Rutas de la API
app.use("/api", productosRoutes);
app.use("/api", empresaRoute);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
