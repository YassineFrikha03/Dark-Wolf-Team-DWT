const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const upload = require('../middlewares/upload');

// @desc    Téléverser un fichier média (vidéo MP4, affiche, photo produit, bannière, avatar)
// @route   POST /api/upload
// @access  Public / Admin
router.post('/', (req, res) => {
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Erreur Multer upload :', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'Erreur lors du téléversement du fichier'
      });
    }

    const file = req.file || (req.files && req.files[0]);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier n\'a été fourni pour le téléversement'
      });
    }

    // URL d'accès relative et absolue
    const filePath = `/uploads/${file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;

    // Copie de sécurité dans le dossier public/uploads du frontend pour rafraîchissement immédiat
    try {
      const frontendPublicUploads = path.join(__dirname, '../../dwt-frontend/public/uploads');
      if (fs.existsSync(frontendPublicUploads)) {
        fs.copyFileSync(file.path, path.join(frontendPublicUploads, file.filename));
      }
    } catch (copyErr) {
      // Ignorer si dossier inaccessible
    }

    const isVideo = file.mimetype.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|ogg|m4v)$/i.test(file.filename);

    res.status(200).json({
      success: true,
      message: isVideo ? 'Vidéo téléversée avec succès ! 🐺🎬' : 'Image téléversée avec succès !',
      fileUrl: filePath,
      filePath: filePath,
      url: fullUrl,
      isVideo,
      file: {
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        path: filePath,
        url: fullUrl,
        isVideo
      }
    });
  });
});

module.exports = router;
