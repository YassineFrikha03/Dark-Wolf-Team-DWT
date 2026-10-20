const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Assurer que le dossier uploads existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Filtre pour les types de fichiers (images et vidéos)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg|avif|mp4|webm|mov|mkv|avi|ogg|m4v/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Format non supporté. Seules les images (PNG, JPG, WEBP) et vidéos (MP4, WEBM, MOV, MKV) sont acceptées !'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 250 * 1024 * 1024 }, // 250MB max pour les vidéos et images HD
  fileFilter: fileFilter
});

module.exports = upload;
