const express = require('express');
const router = express.Router();
const {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getDistinctGames
} = require('../controllers/playerController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getPlayers);
router.get('/games/list', getDistinctGames);
router.get('/:id', getPlayerById);

// Routes réservées au staff et administrateurs
router.post('/', protect, authorize('admin', 'moderator'), createPlayer);
router.put('/:id', protect, authorize('admin', 'moderator'), updatePlayer);
router.delete('/:id', protect, authorize('admin'), deletePlayer);

module.exports = router;
