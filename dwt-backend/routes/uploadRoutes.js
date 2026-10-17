const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { protect } = require('../middlewares/auth');

// @desc    Téléverser une image (avatar, logo, bannière d'article)
// @route   POST /api/upload
// @access  Privé
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier image n\'a été fourni'
    });
  }

  // URL d'accès relative et absolue
  const filePath = `/uploads/${req.file.filename}`;
  const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;

  res.status(200).json({
    success: true,
    message: 'Fichier téléversé avec succès !',
    file: {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: filePath,
      url: fullUrl
    }
  });
});

module.exports = router;
