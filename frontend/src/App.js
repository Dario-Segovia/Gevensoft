import React from "react";
import { Routes, Route } from "react-router-dom";

import Carta from "./pages/CartaPage/Carta";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Carta />} />
      <Route path="/carta" element={<Carta />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
     
    </Routes>
  );
}

export default App;
