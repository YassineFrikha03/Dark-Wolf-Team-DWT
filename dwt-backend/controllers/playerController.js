const Player = require('../models/Player');

// @desc    Obtenir tous les joueurs (avec filtres optionnels par jeu, statut)
// @route   GET /api/players
// @access  Public
const getPlayers = async (req, res, next) => {
  try {
    const { game, isStarter, search } = req.query;
    let query = { isActive: true };

    if (game) {
      query.game = { $regex: new RegExp(game, 'i') };
    }
    if (isStarter !== undefined) {
      query.isStarter = isStarter === 'true';
    }
    if (search) {
      query.$or = [
        { gamertag: { $regex: search, $options: 'i' } },
        { realName: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    const players = await Player.find(query).sort({ game: 1, isStarter: -1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: players.length,
      players
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un joueur par son ID ou Gamertag
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let player;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      player = await Player.findById(id);
    } else {
      player = await Player.findOne({ gamertag: new RegExp(`^${id}$`, 'i') });
    }

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur introuvable'
      });
    }

    res.status(200).json({
      success: true,
      player
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un joueur
// @route   POST /api/players
// @access  Privé (Admin/Modérateur)
const createPlayer = async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Joueur ajouté à la team avec succès ! 🐺',
      player
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un joueur
// @route   PUT /api/players/:id
// @access  Privé (Admin/Modérateur)
const updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil du joueur mis à jour avec succès',
      player
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un joueur
// @route   DELETE /api/players/:id
// @access  Privé (Admin)
const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur introuvable'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Joueur retiré du roster DWT'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Liste des jeux distincts dans les rosters
// @route   GET /api/players/games/list
// @access  Public
const getDistinctGames = async (req, res, next) => {
  try {
    const games = await Player.distinct('game');
    res.status(200).json({
      success: true,
      games
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getDistinctGames
};
