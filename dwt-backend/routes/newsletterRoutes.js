const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  broadcastNews,
  getSubscribers
} = require('../controllers/newsletterController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Administration de la newsletter
router.post('/broadcast', protect, authorize('admin'), broadcastNews);
router.get('/subscribers', protect, authorize('admin'), getSubscribers);

module.exports = router;
