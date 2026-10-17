// Middleware centralisé de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de l'erreur pour les développeurs
  console.error('⚠️ [Erreur Serveur] :', err);

  // Erreur ID Mongoose invalide (CastError)
  if (err.name === 'CastError') {
    const message = `Ressource non trouvée avec l'identifiant spécifié (${err.value})`;
    return res.status(404).json({ success: false, message });
  }

  // Erreur de duplication de clé unique Mongoose (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'Champ';
    const value = err.keyValue ? err.keyValue[field] : '';
    const message = `La valeur '${value}' pour '${field}' est déjà utilisée.`;
    return res.status(400).json({ success: false, message });
  }

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Jeton de sécurité invalide' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Jeton de sécurité expiré' });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur DWT'
  });
};

module.exports = errorHandler;
