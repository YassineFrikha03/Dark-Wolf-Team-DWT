const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetCode,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { authLimiter, resetCodeLimiter } = require('../middlewares/rateLimiter');

// Routes publiques d'authentification
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Système de réinitialisation de mot de passe par code de sécurité à 6 chiffres par email
router.post('/forgot-password', resetCodeLimiter, forgotPassword);
router.post('/verify-code', verifyResetCode);
router.post('/reset-password', resetPassword);

// Routes privées utilisateur
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
