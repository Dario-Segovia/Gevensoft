const express = require('express');
const router = express.Router();
const {
  getEmpresa,
  getEmpresaWeb,
} = require('../controllers/empresaController');

router.get('/empresa', getEmpresa);
router.get('/empresaweb', getEmpresaWeb);

module.exports = router;
