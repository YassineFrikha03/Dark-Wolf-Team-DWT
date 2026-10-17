const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/auth');

// Soumission publique de candidature
router.post('/', submitApplication);

// Gestion administrative des candidatures
router.get('/', protect, authorize('admin', 'moderator'), getApplications);
router.get('/:id', protect, authorize('admin', 'moderator'), getApplicationById);
router.put('/:id/status', protect, authorize('admin', 'moderator'), updateApplicationStatus);
router.delete('/:id', protect, authorize('admin'), deleteApplication);

module.exports = router;
