const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes privées
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dark_wolf_team_secret_key_2026');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé avec ce jeton'
        });
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Ce compte utilisateur a été désactivé'
        });
      }

      next();
    } catch (error) {
      console.error('Erreur token JWT :', error.message);
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé, jeton invalide ou expiré'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé, aucun jeton d\'authentification fourni'
    });
  }
};

// Middleware pour restreindre par rôle (ex: admin, moderator)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle (${req.user ? req.user.role : 'inconnu'}) n'a pas les autorisations nécessaires pour cette action`
      });
    }
    next();
  };
};

// Authentification facultative (récupère l'utilisateur si connecté, mais ne bloque pas si non connecté)
const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dark_wolf_team_secret_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, authorize, optionalAuth };
