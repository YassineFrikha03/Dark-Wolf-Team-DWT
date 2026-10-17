const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsBySlugOrId,
  createNews,
  updateNews,
  deleteNews,
  toggleLikeNews
} = require('../controllers/newsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getAllNews);
router.get('/:idOrSlug', getNewsBySlugOrId);

// Interaction utilisateur (like)
router.post('/:id/like', protect, toggleLikeNews);

// Administration des articles
router.post('/', protect, authorize('admin', 'moderator'), createNews);
router.put('/:id', protect, authorize('admin', 'moderator'), updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router;
