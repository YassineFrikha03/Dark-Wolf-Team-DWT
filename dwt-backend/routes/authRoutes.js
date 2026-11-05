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
  resetPassword,
  googleAuth,
  googleAuthCallback,
  discordAuth,
  discordAuthCallback,
  socialDemoLogin
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { authLimiter, resetCodeLimiter } = require('../middlewares/rateLimiter');

// Routes publiques d'authentification
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Connexions Sociales OAuth (Google & Discord)
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

router.get('/discord', discordAuth);
router.get('/discord/callback', discordAuthCallback);

router.get('/social-demo', socialDemoLogin);

// Système de réinitialisation de mot de passe par code de sécurité à 6 chiffres par email
router.post('/forgot-password', resetCodeLimiter, forgotPassword);
router.post('/verify-code', verifyResetCode);
router.post('/reset-password', resetPassword);

// Routes privées utilisateur
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
