const express = require('express');
const router = express.Router();
const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
} = require('../controllers/gameController');
const { protect, authorize } = require('../middlewares/auth');

// Routes publiques
router.get('/', getGames);
router.get('/:id', getGameById);

// Routes protégées pour l'administration des jeux
router.post('/', protect, authorize('admin', 'moderator'), createGame);
router.put('/:id', protect, authorize('admin', 'moderator'), updateGame);
router.delete('/:id', protect, authorize('admin'), deleteGame);

module.exports = router;
