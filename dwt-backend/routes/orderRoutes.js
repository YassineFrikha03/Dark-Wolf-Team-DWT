const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getRevenueStats
} = require('../controllers/orderController');
const { protect, authorize, optionalAuth } = require('../middlewares/auth');

// Passer une commande (avec ou sans compte connecté)
router.post('/', optionalAuth, createOrder);

// Statistiques financières et chiffre d'affaires (Admin)
router.get('/revenue-stats', protect, authorize('admin', 'moderator'), getRevenueStats);

// Commandes de l'utilisateur connecté
router.get('/my-orders', protect, getMyOrders);

// Administration des commandes (liste complète)
router.get('/', protect, authorize('admin', 'moderator'), getAllOrders);

// Détail d'une commande
router.get('/:id', optionalAuth, getOrderById);
router.put('/:id/status', protect, authorize('admin', 'moderator'), updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;
