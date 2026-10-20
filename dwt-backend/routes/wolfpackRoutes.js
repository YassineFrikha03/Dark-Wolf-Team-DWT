const express = require('express');
const router = express.Router();
const {
  getWolfProfile,
  equipFrame,
  voteMVP
} = require('../controllers/wolfpackController');
const { protect } = require('../middlewares/auth');

router.get('/profile', protect, getWolfProfile);
router.put('/frame', protect, equipFrame);
router.post('/vote-mvp', protect, voteMVP);

module.exports = router;
