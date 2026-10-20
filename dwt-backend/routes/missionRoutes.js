const express = require('express');
const router = express.Router();
const {
  getWeeklyMissions,
  completeMission,
  claimWeeklyBonus
} = require('../controllers/missionController');
const { protect, optionalAuth } = require('../middlewares/auth');

// Public (avec info perso si connecté)
router.get('/weekly', optionalAuth, getWeeklyMissions);

// Privé
router.post('/claim-bonus', protect, claimWeeklyBonus);
router.post('/:code/complete', protect, completeMission);

module.exports = router;
