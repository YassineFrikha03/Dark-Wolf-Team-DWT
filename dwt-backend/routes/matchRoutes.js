const express = require('express');
const router = express.Router();
const {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  rsvpMatch
} = require('../controllers/matchController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getMatches);
router.get('/:id', getMatchById);

// RSVP pour les joueurs
router.post('/:id/rsvp', protect, rsvpMatch);

// Gestion des matchs par les admins / staff
router.post('/', protect, authorize('admin', 'moderator'), createMatch);
router.put('/:id', protect, authorize('admin', 'moderator'), updateMatch);
router.delete('/:id', protect, authorize('admin'), deleteMatch);

module.exports = router;
