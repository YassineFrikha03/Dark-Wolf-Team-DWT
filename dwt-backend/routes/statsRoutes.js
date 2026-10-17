const express = require('express');
const router = express.Router();
const {
  getTeamOverviewStats,
  getAdminDashboardStats
} = require('../controllers/statsController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/overview', getTeamOverviewStats);
router.get('/admin-dashboard', protect, authorize('admin', 'moderator'), getAdminDashboardStats);

module.exports = router;
