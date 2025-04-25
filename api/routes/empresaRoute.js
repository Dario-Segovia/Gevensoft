const express = require('express');
const router = express.Router();
const {
  getEmpresa,
} = require('../controllers/empresaController');

router.get('/empresa', getEmpresa);

module.exports = router;
