const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide');

const defaultSlides = [
  {
    title: 'HUNT. DOMINATE. CONQUER.',
    subtitle: 'Dark Wolf Team — Elite esports. Dark Lab — Premium gear crafted for champions who refuse to lose.',
    label: 'New Collection 2026',
    backgroundImage: '/backgrounds/hero-gaming-bg.jpg',
    btn1Text: 'Shop Collection',
    btn1Target: '#shop',
    btn2Text: 'Meet the Pack',
    btn2Target: '#teams',
    order: 0,
    isActive: true
  },
  {
    title: 'PRO GEAR ONLY.',
    subtitle: 'Performance-grade equipment engineered for the elite. Built by wolves, worn by champions.',
    label: 'Dark Lab Pro Kit',
    backgroundImage: '/backgrounds/bg-red-moon-pack.png',
    btn1Text: 'View Pro Kit',
    btn1Target: '#shop:pro-kit',
    btn2Text: 'Meet the Pack',
    btn2Target: '#teams',
    order: 1,
    isActive: true
  },
  {
    title: 'LIMITED COLLAB DROP.',
    subtitle: 'Exclusive collaborations. Limited units. Zero reprints. Move fast or miss out.',
    label: 'Exclusive Collabs Drop',
    backgroundImage: '/backgrounds/bg-alpha-eyes.png',
    btn1Text: 'See Collabs',
    btn1Target: '#shop:collabs',
    btn2Text: 'Next Drop Timer',
    btn2Target: '#countdown',
    order: 2,
    isActive: true
  }
];

// @desc    Obtenir toutes les diapositives cinématiques
// @route   GET /api/slides
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let slides = await Slide.find().sort({ order: 1, createdAt: -1 });

    // Auto-seed si la collection est vide
    if (slides.length === 0) {
      slides = await Slide.insertMany(defaultSlides);
    }

    // Filtrer les slides actives si demandé
    if (req.query.active === 'true') {
      slides = slides.filter(s => s.isActive);
    }

    res.status(200).json({
      success: true,
      count: slides.length,
      slides
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Créer une nouvelle affiche cinématique
// @route   POST /api/slides
// @access  Privé (Admin)
router.post('/', async (req, res, next) => {
  try {
    const slide = await Slide.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Affiche cinématique ajoutée avec succès ! 🐺🎬',
      slide
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Modifier une affiche cinématique
// @route   PUT /api/slides/:id
// @access  Privé (Admin)
router.put('/:id', async (req, res, next) => {
  try {
    const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Affiche introuvable' });
    }
    res.status(200).json({
      success: true,
      message: 'Affiche cinématique mise à jour ! 🎬',
      slide
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Supprimer une affiche cinématique
// @route   DELETE /api/slides/:id
// @access  Privé (Admin)
router.delete('/:id', async (req, res, next) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ success: false, message: 'Affiche introuvable' });
    }
    res.status(200).json({
      success: true,
      message: 'Affiche supprimée du carrousel cinématique'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
