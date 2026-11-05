const express = require('express');
const router = express.Router();
const {
  getCustomGear,
  getAllCustomGearAdmin,
  updateCustomGear,
  createCustomGear,
  deleteCustomGear,
  resetCustomGear
} = require('../controllers/customGearController');
const { protect, authorize } = require('../middlewares/auth');

// Route publique pour le studio custom
router.get('/', getCustomGear);

// Routes privées sécurisées pour l'administrateur
router.get('/admin/all', protect, authorize('admin', 'moderator'), getAllCustomGearAdmin);
router.put('/:id', protect, authorize('admin', 'moderator'), updateCustomGear);
router.post('/', protect, authorize('admin', 'moderator'), createCustomGear);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteCustomGear);
router.post('/reset', protect, authorize('admin', 'moderator'), resetCustomGear);

module.exports = router;
