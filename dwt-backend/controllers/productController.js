const Product = require('../models/Product');

// @desc    Obtenir tous les produits avec filtres (catégorie, prix, stock, recherche)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, featured, inStock, search, sort, minPrice, maxPrice } = req.query;
    let query = {};

    if (category) query.category = category;
    if (featured !== undefined) query.isFeatured = featured === 'true';
    if (inStock !== undefined) query.inStock = inStock === 'true';

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    if (sort === 'price-desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un produit par son ID ou son slug
// @route   GET /api/products/:idOrSlug
// @access  Public
const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let product;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(idOrSlug);
    } else {
      product = await Product.findOne({ slug: idOrSlug });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit introuvable dans la boutique'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir la liste des catégories de la boutique
// @route   GET /api/products/categories/list
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau produit
// @route   POST /api/products
// @access  Privé (Admin)
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Produit ajouté à la boutique avec succès ! 🛍️',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un produit
// @route   PUT /api/products/:id
// @access  Privé (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un produit
// @route   DELETE /api/products/:id
// @access  Privé (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit retiré de la boutique'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajuster rapidement le stock d'un produit (Gestion des stocks)
// @route   PATCH /api/products/:id/stock
// @access  Privé (Admin)
const updateProductStock = async (req, res, next) => {
  try {
    const { stockCount, delta } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit introuvable'
      });
    }

    if (stockCount !== undefined) {
      product.stockCount = Math.max(0, Number(stockCount));
    } else if (delta !== undefined) {
      product.stockCount = Math.max(0, product.stockCount + Number(delta));
    }

    product.inStock = product.stockCount > 0;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Stock mis à jour (${product.stockCount} unités)`,
      product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
};

