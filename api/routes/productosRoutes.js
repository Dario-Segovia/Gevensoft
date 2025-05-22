const express = require('express');
const router = express.Router();
const {
  getCategorias,
  getProductosPorCategoria,
  getProductosMasPedidos,
  getProductos,
} = require('../controllers/productosController');

router.get('/categorias', getCategorias);
router.get('/productos/categoria/:idCategoria', getProductosPorCategoria);
router.get('/productos',getProductos)

module.exports = router;
