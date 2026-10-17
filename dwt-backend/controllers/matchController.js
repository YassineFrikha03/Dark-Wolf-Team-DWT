const Match = require('../models/Match');

// @desc    Obtenir tous les matchs avec filtres (statut, jeu)
// @route   GET /api/matches
// @access  Public
const getMatches = async (req, res, next) => {
  try {
    const { status, game, limit } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (game) {
      query.game = { $regex: new RegExp(game, 'i') };
    }

    const sortOption = status === 'finished' ? { matchDate: -1 } : { matchDate: 1 };
    const queryBuilder = Match.find(query).sort(sortOption);

    if (limit) {
      queryBuilder.limit(parseInt(limit, 10));
    }

    const matches = await queryBuilder;
    res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un match spécifique
// @route   GET /api/matches/:id
// @access  Public
const getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match introuvable'
      });
    }

    res.status(200).json({
      success: true,
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un nouveau match
// @route   POST /api/matches
// @access  Privé (Admin/Staff)
const createMatch = async (req, res, next) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Match programmé avec succès ! ⚔️',
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un match (statut, score, streaming)
// @route   PUT /api/matches/:id
// @access  Privé (Admin/Staff)
const updateMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Match mis à jour avec succès',
      match
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un match
// @route   DELETE /api/matches/:id
// @access  Privé (Admin)
const deleteMatch = async (req, res, next) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Match supprimé avec succès'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};
