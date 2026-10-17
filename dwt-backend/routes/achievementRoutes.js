const express = require('express');
const router = express.Router();
const {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getAchievements);

// Administration des succès
router.post('/', protect, authorize('admin', 'moderator'), createAchievement);
router.put('/:id', protect, authorize('admin', 'moderator'), updateAchievement);
router.delete('/:id', protect, authorize('admin'), deleteAchievement);

module.exports = router;
