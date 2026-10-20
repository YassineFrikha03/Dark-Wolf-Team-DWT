const express = require('express');
const router = express.Router();
const MuseumItem = require('../models/MuseumItem');

// Données initiales par défaut si la collection est vide
const defaultMuseumItems = [
  {
    name: 'Season 1 Jersey',
    cat: 'Pro Kit',
    year: '2022',
    price: 'TND 79',
    image: '/museum/season1-jersey.jpg',
    desc: 'The very first DWT competition jersey. Worn during the inaugural season. Only 50 were ever made.',
    order: 0,
    isActive: true
  },
  {
    name: 'OG Wolf Tee',
    cat: 'Limited Drop',
    year: '2021',
    price: 'TND 45',
    image: '/museum/og-wolf-tee.jpg',
    desc: 'The original Dark Wolf Team t-shirt. Simple. Raw. Where it all began. This started the culture.',
    order: 1,
    isActive: true
  },
  {
    name: 'Launch Hoodie 001',
    cat: 'New Collection',
    year: '2021',
    price: 'TND 99',
    image: '/museum/launch-hoodie-001.jpg',
    desc: 'First Dark Lab hoodie ever released. Sold out in 4 hours. Never reprinted. A true piece of DWT history.',
    order: 2,
    isActive: true
  },
  {
    name: 'Collab Wolf x Nocturne',
    cat: 'Collabs',
    year: '2023',
    price: 'TND 120',
    image: '/museum/collab-wolf-nocturne.jpg',
    desc: 'Collaboration with Nocturne design studio. 100 units. Hand-signed by DWT players. Legendary status.',
    order: 3,
    isActive: true
  },
  {
    name: 'Season 2 Competition Kit',
    cat: 'Pro Kit',
    year: '2023',
    price: 'TND 89',
    image: '/museum/season2-pro-kit.jpg',
    desc: 'Full kit worn during our first international tournament. The pack wore this into battle and came back champions.',
    order: 4,
    isActive: true
  },
  {
    name: 'Archive Cap Vol.1',
    cat: 'Accessories',
    year: '2022',
    price: 'TND 38',
    image: '/museum/archive-cap-vol1.jpg',
    desc: 'First ever Dark Lab headwear drop. Wool-blend construction. A collector piece for true DWT supporters.',
    order: 5,
    isActive: true
  }
];

// @route   GET /api/museum
// @desc    Obtenir tous les articles actifs du musée
router.get('/', async (req, res) => {
  try {
    const items = await MuseumItem.find({ isActive: true }).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Erreur GET /api/museum:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
});

// @route   GET /api/museum/admin
// @desc    Obtenir tous les articles (actifs et inactifs) pour le dashboard
router.get('/admin', async (req, res) => {
  try {
    const items = await MuseumItem.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('Erreur GET /api/museum/admin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
});

// @route   POST /api/museum
// @desc    Créer un nouvel article de musée
router.post('/', async (req, res) => {
  try {
    const { name, cat, year, price, image, desc, order, isActive } = req.body;

    if (!name || !image) {
      return res.status(400).json({ success: false, message: 'Le nom et l’image sont obligatoires' });
    }

    const newItem = await MuseumItem.create({
      name,
      cat: cat || 'Archive',
      year: year || new Date().getFullYear().toString(),
      price: price || 'TND 0',
      image,
      desc: desc || '',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    res.status(201).json({
      success: true,
      message: 'Article de musée créé avec succès',
      item: newItem
    });
  } catch (error) {
    console.error('Erreur POST /api/museum:', error);
    res.status(500).json({ success: false, message: 'Erreur création', error: error.message });
  }
});

// @route   PUT /api/museum/:id
// @desc    Modifier un article de musée
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MuseumItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Article introuvable' });
    }

    res.json({
      success: true,
      message: 'Article mis à jour avec succès',
      item: updatedItem
    });
  } catch (error) {
    console.error('Erreur PUT /api/museum/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur mise à jour', error: error.message });
  }
});

// @route   DELETE /api/museum/:id
// @desc    Supprimer un article de musée
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MuseumItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Article introuvable' });
    }

    res.json({
      success: true,
      message: 'Article supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur DELETE /api/museum/:id:', error);
    res.status(500).json({ success: false, message: 'Erreur suppression', error: error.message });
  }
});

module.exports = router;
