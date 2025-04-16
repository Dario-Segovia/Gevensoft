const express = require('express');
const router = express.Router();
const {
  getCategorias,
  getProductosPorCategoria,
  getProductosMasPedidos,
} = require('../controllers/productosController');

router.get('/categorias', getCategorias);
router.get('/productos/categoria/:idCategoria', getProductosPorCategoria);
router.get('/productos/mas-pedidos', getProductosMasPedidos);

module.exports = router;
