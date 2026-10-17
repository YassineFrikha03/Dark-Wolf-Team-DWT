const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdOrSlug,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/:idOrSlug', getProductByIdOrSlug);

// Administration des produits de la boutique
router.post('/', protect, authorize('admin', 'moderator'), createProduct);
router.put('/:id', protect, authorize('admin', 'moderator'), updateProduct);
router.patch('/:id/stock', protect, authorize('admin', 'moderator'), updateProductStock);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
