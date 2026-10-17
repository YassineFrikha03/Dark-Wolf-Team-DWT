const News = require('../models/News');

// @desc    Obtenir tous les articles d'actualités avec pagination et filtres
// @route   GET /api/news
// @access  Public
const getAllNews = async (req, res, next) => {
  try {
    const { category, game, featured, search, page = 1, limit = 10 } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;
    if (game) query.game = { $regex: new RegExp(game, 'i') };
    if (featured !== undefined) query.isFeatured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await News.countDocuments(query);
    const articles = await News.find(query)
      .populate('author', 'gamertag avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit, 10)),
      currentPage: parseInt(page, 10),
      articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un article par ID ou slug
// @route   GET /api/news/:idOrSlug
// @access  Public
const getNewsBySlugOrId = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    let article;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      article = await News.findById(idOrSlug).populate('author', 'gamertag avatar');
    } else {
      article = await News.findOne({ slug: idOrSlug }).populate('author', 'gamertag avatar');
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article introuvable'
      });
    }

    // Incrémenter le compteur de vues
    article.views = (article.views || 0) + 1;
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un article d'actualité
// @route   POST /api/news
// @access  Privé (Admin/Staff)
const createNews = async (req, res, next) => {
  try {
    const newsData = {
      ...req.body,
      author: req.user._id,
      authorName: req.user.gamertag
    };

    const article = await News.create(newsData);
    res.status(201).json({
      success: true,
      message: 'Article publié avec succès ! 📰',
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Modifier un article
// @route   PUT /api/news/:id
// @access  Privé (Admin/Staff)
const updateNews = async (req, res, next) => {
  try {
    const article = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article mis à jour avec succès',
      article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un article
// @route   DELETE /api/news/:id
// @access  Privé (Admin)
const deleteNews = async (req, res, next) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article supprimé'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Aimer / Ne plus aimer un article
// @route   POST /api/news/:id/like
// @access  Privé
const toggleLikeNews = async (req, res, next) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article introuvable'
      });
    }

    const userIdStr = req.user._id.toString();
    const hasLiked = article.likes.some((id) => id.toString() === userIdStr);

    if (hasLiked) {
      article.likes = article.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      article.likes.push(req.user._id);
    }

    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      liked: !hasLiked,
      likesCount: article.likes.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNews,
  getNewsBySlugOrId,
  createNews,
  updateNews,
  deleteNews,
  toggleLikeNews
};
