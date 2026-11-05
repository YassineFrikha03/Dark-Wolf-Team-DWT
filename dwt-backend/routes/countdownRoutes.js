const express = require('express');
const router = express.Router();
const Countdown = require('../models/Countdown');

const defaultEvent = {
  title: 'DWT Summer Championship 2026',
  subtitle: '— Next Major Event —',
  targetDate: new Date('2026-08-15T18:00:00'),
  description: 'Le plus grand tournoi esport de la saison organisé par Dark Wolf Team. Venez soutenir la meute !',
  badge: 'ÉVÉNEMENT MAJEUR',
  game: 'Valorant',
  buttonText: 'Voir le Tournoi',
  buttonLink: '#tournois',
  isActive: true
};

// @desc    Obtenir l'événement et compte à rebours actif
// @route   GET /api/countdown
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    let countdown = await Countdown.findOne({ isActive: true });

    // Si aucun actif n'est trouvé, vérifier s'il existe des comptes à rebours
    if (!countdown) {
      const anyCountdown = await Countdown.findOne().sort({ createdAt: -1 });
      if (anyCountdown) {
        countdown = anyCountdown;
        countdown.isActive = true;
        await countdown.save();
      } else {
        // Créer l'événement par défaut
        countdown = await Countdown.create(defaultEvent);
      }
    }

    res.status(200).json({
      success: true,
      countdown
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Obtenir la liste de tous les événements / comptes à rebours
// @route   GET /api/countdown/all
// @access  Public / Admin
router.get('/all', async (req, res, next) => {
  try {
    let events = await Countdown.find().sort({ createdAt: -1 });

    if (events.length === 0) {
      const created = await Countdown.create(defaultEvent);
      events = [created];
    }

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Ajouter un nouvel événement avec compte à rebours
// @route   POST /api/countdown
// @access  Privé (Admin)
router.post('/', async (req, res, next) => {
  try {
    const { title, subtitle, targetDate, description, badge, game, buttonText, buttonLink, isActive } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Le titre de l'événement est obligatoire" });
    }

    if (!targetDate) {
      return res.status(400).json({ success: false, message: 'La date cible est obligatoire' });
    }

    const shouldBeActive = isActive !== undefined ? Boolean(isActive) : true;

    if (shouldBeActive) {
      // Désactiver tous les autres pour que celui-ci soit l'actif
      await Countdown.updateMany({}, { isActive: false });
    }

    const newCountdown = await Countdown.create({
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : '— Next Major Event —',
      targetDate: new Date(targetDate),
      description: description ? description.trim() : '',
      badge: badge ? badge.trim() : 'ÉVÉNEMENT MAJEUR',
      game: game ? game.trim() : '',
      buttonText: buttonText ? buttonText.trim() : 'Voir les Détails',
      buttonLink: buttonLink ? buttonLink.trim() : '#tournois',
      isActive: shouldBeActive
    });

    res.status(201).json({
      success: true,
      message: 'Compteur d\'attente de l\'événement configuré avec succès ! ⏳🐺',
      countdown: newCountdown
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Modifier un événement avec compte à rebours
// @route   PUT /api/countdown/:id
// @access  Privé (Admin)
router.put('/:id', async (req, res, next) => {
  try {
    const { title, subtitle, targetDate, description, badge, game, buttonText, buttonLink, isActive } = req.body;

    if (isActive) {
      await Countdown.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (subtitle !== undefined) updateData.subtitle = subtitle.trim();
    if (targetDate !== undefined) updateData.targetDate = new Date(targetDate);
    if (description !== undefined) updateData.description = description.trim();
    if (badge !== undefined) updateData.badge = badge.trim();
    if (game !== undefined) updateData.game = game.trim();
    if (buttonText !== undefined) updateData.buttonText = buttonText.trim();
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const updated = await Countdown.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Événement introuvable' });
    }

    res.status(200).json({
      success: true,
      message: 'Compteur d\'attente de l\'événement mis à jour avec succès ! ⏳✨',
      countdown: updated
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Activer un événement comme compte à rebours officiel du site
// @route   PUT /api/countdown/:id/activate
// @access  Privé (Admin)
router.put('/:id/activate', async (req, res, next) => {
  try {
    await Countdown.updateMany({}, { isActive: false });
    const activated = await Countdown.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!activated) {
      return res.status(404).json({ success: false, message: 'Événement introuvable' });
    }

    res.status(200).json({
      success: true,
      message: 'Cet événement est maintenant actif sur la page d\'accueil ! 🐺🔥',
      countdown: activated
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Supprimer un événement du compte à rebours
// @route   DELETE /api/countdown/:id
// @access  Privé (Admin)
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Countdown.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Événement introuvable' });
    }

    // Si l'événement supprimé était actif, activer le plus récent restant
    if (deleted.isActive) {
      const remaining = await Countdown.findOne().sort({ createdAt: -1 });
      if (remaining) {
        remaining.isActive = true;
        await remaining.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Événement supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
