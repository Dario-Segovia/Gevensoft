import React from "react";
import { Routes, Route } from "react-router-dom";

import Carta from "./pages/CartaPage/Carta";
import Nosotros from "./pages/NosotrosPage/Nosotros";
import Contacto from "./pages/ContactosPage/Contacto";
import Home from "./pages/HomePage/Home";
import Carrito from "./pages/CarritoPage/Carrito";
import "./App.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/carta" element={<Carta />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/carrito" element={<Carrito />} />
     
    </Routes>
  );
}

export default App;
