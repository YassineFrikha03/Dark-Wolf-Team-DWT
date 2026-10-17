const Achievement = require('../models/Achievement');

// @desc    Obtenir tous les trophées et succès de l'équipe
// @route   GET /api/achievements
// @access  Public
const getAchievements = async (req, res, next) => {
  try {
    const { game } = req.query;
    let query = {};
    if (game) query.game = { $regex: new RegExp(game, 'i') };

    const achievements = await Achievement.find(query).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: achievements.length,
      achievements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ajouter un titre/succès
// @route   POST /api/achievements
// @access  Privé (Admin/Staff)
const createAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Succès / Trophée ajouté au palmarès DWT ! 🏆',
      achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un succès
// @route   PUT /api/achievements/:id
// @access  Privé (Admin/Staff)
const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Succès introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Palmarès mis à jour',
      achievement
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un succès
// @route   DELETE /api/achievements/:id
// @access  Privé (Admin)
const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Succès introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Succès supprimé du palmarès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
