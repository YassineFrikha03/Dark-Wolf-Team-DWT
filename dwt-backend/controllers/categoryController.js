const Category = require('../models/Category');
const Product = require('../models/Product');

// Catégories par défaut initiales si la collection est vide
const DEFAULT_CATEGORIES = [
  { name: 'Maillots', description: 'Maillots officiels DWT de compétition' },
  { name: 'Vêtements', description: 'Hoodies, t-shirts et vestes esport' },
  { name: 'Accessoires', description: 'Casquettes, bonnets et gourdes' },
  { name: 'Périphériques', description: 'Tapis de souris XXL et matériel gamer' },
  { name: 'Goodies', description: 'Stickers, porte-clés et badges meute' }
];

// @desc    Obtenir toutes les catégories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    let categories = await Category.find().sort({ name: 1 });
    
    // Si la collection est vide, initialiser avec les catégories de base
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES);
      categories = await Category.find().sort({ name: 1 });
    }

    // Récupérer le décompte de produits par catégorie
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat.name });
        return {
          ...cat.toObject(),
          productCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer une nouvelle catégorie
// @route   POST /api/categories
// @access  Privé (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la catégorie est obligatoire'
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Cette catégorie existe déjà'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || '',
      icon: icon || 'Tag'
    });

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      category: {
        ...category.toObject(),
        productCount: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour une catégorie
// @route   PUT /api/categories/:id
// @access  Privé (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const oldCategory = await Category.findById(req.params.id);

    if (!oldCategory) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie introuvable'
      });
    }

    const oldName = oldCategory.name;
    if (name && name.trim()) {
      oldCategory.name = name.trim();
    }
    if (description !== undefined) oldCategory.description = description;
    if (icon) oldCategory.icon = icon;

    await oldCategory.save();

    // Mettre à jour les produits associés si le nom a changé
    if (name && name.trim() !== oldName) {
      await Product.updateMany({ category: oldName }, { category: name.trim() });
    }

    const productCount = await Product.countDocuments({ category: oldCategory.name });

    res.status(200).json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      category: {
        ...oldCategory.toObject(),
        productCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer une catégorie
// @route   DELETE /api/categories/:id
// @access  Privé (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie introuvable'
      });
    }

    // Réassigner les produits de cette catégorie à 'Général' ou 'Accessoires'
    await Product.updateMany(
      { category: category.name },
      { category: 'Accessoires' }
    );

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
