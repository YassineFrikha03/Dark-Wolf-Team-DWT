const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

const defaultVideos = [
  {
    title: 'DARK WOLF TEAM — RISE OF THE PACK (Trailer Officiel 2026)',
    subtitle: 'Trailer cinématique officiel de la saison 2026',
    description: 'Plongez au cœur de la tanière de la Dark Wolf Team. Retrouvez nos joueurs professionnels sur Valorant, CS2 et LoL dans le trailer cinématique officiel de la saison 2026.',
    category: 'trailer',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/hero-gaming-bg.jpg',
    duration: '02:38',
    views: '185K vues',
    badge: 'TRAILER OFFICIEL',
    isMainTrailer: true,
    ctaText: 'Rejoindre la Meute',
    ctaLink: '#join',
    order: 0,
    isActive: true
  },
  {
    title: 'Spot Officiel — Maillot Pro Kit Summer 2026 | Dark Lab',
    subtitle: 'La nouvelle armure officielle des champions',
    description: 'Découvrez le tout nouveau maillot Pro Kit respirant aux couleurs néon-rouge et noir furtif. Conçu pour la haute performance en tournoi.',
    category: 'product_ad',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/bg-red-moon-pack.png',
    duration: '00:58',
    views: '64K vues',
    badge: 'SPOT PUB BOUTIQUE',
    isMainTrailer: false,
    ctaText: 'Commander le Maillot',
    ctaLink: '#shop:pro-kit',
    order: 1,
    isActive: true
  },
  {
    title: 'Annonce Majeure — Recrutement & Tryouts Meute Valorant 2026',
    subtitle: 'Rejoignez le roster officiel Dark Wolf',
    description: 'La Dark Wolf Team ouvre ses portes aux nouveaux talents. Postulez dès maintenant pour intégrer le roster officiel ou l\'académie.',
    category: 'announcement',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/bg-alpha-eyes.png',
    duration: '01:45',
    views: '42K vues',
    badge: 'ANNONCE RECRUTEMENT',
    isMainTrailer: false,
    ctaText: 'Postuler aux Tryouts',
    ctaLink: '#join',
    order: 2,
    isActive: true
  },
  {
    title: 'Veste Bomber Furtive DWT — Édition Limitée Alpha Drop',
    subtitle: 'Streetwear x Esports Performance',
    description: 'Coupe athlétique premium, broderie cyber-loup haute densité, tissu thermique déperlant. 100 unités disponibles.',
    category: 'product_ad',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/hero-gaming-bg.jpg',
    duration: '01:15',
    views: '51K vues',
    badge: 'SPOT PUB BOUTIQUE',
    isMainTrailer: false,
    ctaText: 'Voir la Veste',
    ctaLink: '#shop',
    order: 3,
    isActive: true
  },
  {
    title: 'DWT vs Cloud9 — Grand Final Highlights (Clutch 1v4 ShadowFang)',
    subtitle: 'Les meilleurs moments de la finale régionale',
    description: 'Revivez les moments les plus intenses de la finale régionale avec les voix in-game et comms de l\'équipe Dark Wolf.',
    category: 'match_highlight',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: '/backgrounds/bg-red-moon-pack.png',
    duration: '08:12',
    views: '112K vues',
    badge: 'BEST-OF MATCH',
    isMainTrailer: false,
    ctaText: 'Tous les Matchs',
    ctaLink: '#matches-live',
    order: 4,
    isActive: true
  }
];

// @desc    Obtenir toutes les vidéos
// @route   GET /api/videos
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let videos = await Video.find().sort({ order: 1, createdAt: -1 });

    // Auto-seed si la collection est vide
    if (videos.length === 0) {
      videos = await Video.insertMany(defaultVideos);
    }

    if (req.query.active === 'true') {
      videos = videos.filter(v => v.isActive);
    }

    if (req.query.category && req.query.category !== 'all') {
      videos = videos.filter(v => v.category === req.query.category);
    }

    res.status(200).json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Créer une nouvelle vidéo
// @route   POST /api/videos
// @access  Privé (Admin)
router.post('/', async (req, res, next) => {
  try {
    // Si la vidéo est marquée comme trailer principal, désactiver le statut sur les autres
    if (req.body.isMainTrailer) {
      await Video.updateMany({}, { isMainTrailer: false });
    }

    const video = await Video.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vidéo ajoutée avec succès ! 🐺🎬',
      video
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Définir une vidéo comme trailer principal
// @route   PUT /api/videos/:id/set-main
// @access  Privé (Admin)
router.put('/:id/set-main', async (req, res, next) => {
  try {
    await Video.updateMany({}, { isMainTrailer: false });
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { isMainTrailer: true, isActive: true },
      { new: true }
    );
    if (!video) {
      return res.status(404).json({ success: false, message: 'Vidéo introuvable' });
    }
    res.status(200).json({
      success: true,
      message: 'Cette vidéo est désormais le Trailer Principal de l\'équipe ! 🐺🔥',
      video
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Modifier une vidéo
// @route   PUT /api/videos/:id
// @access  Privé (Admin)
router.put('/:id', async (req, res, next) => {
  try {
    if (req.body.isMainTrailer) {
      await Video.updateMany({ _id: { $ne: req.params.id } }, { isMainTrailer: false });
    }

    const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!video) {
      return res.status(404).json({ success: false, message: 'Vidéo introuvable' });
    }

    res.status(200).json({
      success: true,
      message: 'Vidéo mise à jour avec succès ! 🎬',
      video
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Supprimer une vidéo
// @route   DELETE /api/videos/:id
// @access  Privé (Admin)
router.delete('/:id', async (req, res, next) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Vidéo introuvable' });
    }

    // S'il ne reste aucun trailer principal, en promouvoir un
    const hasMain = await Video.findOne({ isMainTrailer: true });
    if (!hasMain) {
      await Video.findOneAndUpdate({ isActive: true }, { isMainTrailer: true });
    }

    res.status(200).json({
      success: true,
      message: 'Vidéo supprimée de la médiathèque'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
