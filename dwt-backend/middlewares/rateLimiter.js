const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

// Helper pour vérifier si la requête provient d'une adresse locale (développement)
const isLocalhost = (req) => {
  const ip = req.ip || req.connection?.remoteAddress || '';
  return ip.includes('127.0.0.1') || ip === '::1' || ip === '::ffff:127.0.0.1';
};

// Limiteur pour les tentatives d'authentification (login / register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 30, // 30 tentatives en prod, illimité en dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev || isLocalhost(req),
  message: {
    success: false,
    message: 'Trop de requêtes effectuées. Veuillez réessayer dans 15 minutes.'
  }
});

// Limiteur pour la réinitialisation de code de sécurité
const resetCodeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: isDev ? 200 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev || isLocalhost(req),
  message: {
    success: false,
    message: 'Trop de demandes de code de sécurité. Veuillez patienter 10 minutes.'
  }
});

// Limiteur général d'API (Dashboard, News, Matches, Polling du Chat et Notifs)
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 20000 : 3000, // 3000 requêtes en prod pour supporter le polling continu, illimité en dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev || isLocalhost(req),
  message: {
    success: false,
    message: 'Trop de requêtes sur l\'API. Ralentissez vos requêtes.'
  }
});

module.exports = { authLimiter, resetCodeLimiter, generalApiLimiter };

