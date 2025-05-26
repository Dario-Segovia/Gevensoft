const express = require('express');
const router = express.Router();
const {
  getPedidos,
  getPedidoPorId,
  crearPedido, // Asegúrate de importar esta función también
} = require('../controllers/pedidosController');

router.get('/pedidos', getPedidos);
router.get('/pedidos/:id', getPedidoPorId);
router.post('/pedidos', crearPedido); // 

module.exports = router;
