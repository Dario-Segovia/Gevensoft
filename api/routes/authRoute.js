const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  sendRecoveryToken,
  resetPassword,
} = require('../controllers/authController');

// Endpoints relacionados con autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/recover', sendRecoveryToken);
router.post('/reset-password', resetPassword);

module.exports = router;
