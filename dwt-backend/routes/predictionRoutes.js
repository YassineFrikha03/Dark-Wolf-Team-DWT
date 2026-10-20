const express = require('express');
const router = express.Router();
const {
  createPrediction,
  getMyPredictions,
  getMatchPredictions,
  resolvePredictionsHttp,
  getLeaderboard
} = require('../controllers/predictionController');
const { protect, optionalAuth, authorize } = require('../middlewares/auth');

// Public
router.get('/leaderboard', getLeaderboard);
router.get('/match/:matchId', optionalAuth, getMatchPredictions);

// Privé (Fans connectés)
router.post('/', protect, createPrediction);
router.get('/my', protect, getMyPredictions);

// Admin
router.post('/resolve/:matchId', protect, authorize('admin', 'moderator'), resolvePredictionsHttp);

module.exports = router;
