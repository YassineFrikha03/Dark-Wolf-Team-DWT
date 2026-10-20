const Game = require('../models/Game');

// Initial default games to seed if database is empty
const defaultGames = [
  {
    name: 'Valorant',
    slug: 'valorant',
    logo: 'VAL',
    color: '#ff4655',
    mem: '6 Players',
    posterImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    description: 'Équipe Valorant DWT - Finalistes régionaux MENA',
    order: 1,
    isActive: true
  },
  {
    name: 'FC 25',
    slug: 'fc-25',
    logo: 'FC25',
    color: '#00d4aa',
    mem: '4 Players',
    posterImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    description: 'Équipe EA Sports FC 25 - Champions Summer Split',
    order: 2,
    isActive: true
  },
  {
    name: 'Call of Duty',
    slug: 'call-of-duty',
    logo: 'COD',
    color: '#ff8800',
    mem: '5 Players',
    posterImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    description: 'Équipe Call of Duty Warzone & Search & Destroy',
    order: 3,
    isActive: true
  },
  {
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    logo: 'PUBG',
    color: '#f5d842',
    mem: '4 Players',
    posterImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    description: 'Équipe PUBG Mobile - Top 3 Pro League',
    order: 4,
    isActive: true
  },
  {
    name: 'Fortnite',
    slug: 'fortnite',
    logo: 'FN',
    color: '#00b4ff',
    mem: '3 Players',
    posterImage: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
    description: 'Squad Fortnite Trio compétitif FNCS',
    order: 5,
    isActive: true
  },
  {
    name: 'Rocket League',
    slug: 'rocket-league',
    logo: 'RL',
    color: '#ff6b35',
    mem: '3 Players',
    posterImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
    description: 'Trio Rocket League - Division Championne RLCS',
    order: 6,
    isActive: true
  },
  {
    name: 'EA Sports FC',
    slug: 'ea-sports-fc',
    logo: 'EASF',
    color: '#6bff6b',
    mem: '4 Players',
    posterImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    description: 'Division eFootball et tournois officiels',
    order: 7,
    isActive: true
  },
  {
    name: 'League of Legends',
    slug: 'league-of-legends',
    logo: 'LOL',
    color: '#c89b3c',
    mem: '5 Players',
    posterImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    description: 'Roster League of Legends Rift Champions',
    order: 8,
    isActive: true
  }
];

// @desc    Obtenir tous les jeux
// @route   GET /api/games
// @access  Public
const getGames = async (req, res) => {
  try {
    let games = await Game.find().sort({ order: 1, createdAt: 1 });

    // Si la collection est vide, initialiser avec les jeux par défaut
    if (games.length === 0) {
      await Game.insertMany(defaultGames);
      games = await Game.find().sort({ order: 1, createdAt: 1 });
    }

    if (req.query.active === 'true') {
      games = games.filter(g => g.isActive);
    }

    res.status(200).json({
      success: true,
      count: games.length,
      games
    });
  } catch (error) {
    console.error('Erreur getGames :', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des jeux',
      error: error.message
    });
  }
};

// @desc    Obtenir un jeu par ID ou slug
// @route   GET /api/games/:id
// @access  Public
const getGameById = async (req, res) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: req.params.id } : { slug: req.params.id };

    const game = await Game.findOne(query);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      game
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// @desc    Créer un nouveau jeu
// @route   POST /api/games
// @access  Private/Admin
const createGame = async (req, res) => {
  try {
    const { name, logo, color, mem, posterImage, bannerImage, description, order, isActive } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom du jeu est obligatoire'
      });
    }

    const existingGame = await Game.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingGame) {
      return res.status(400).json({
        success: false,
        message: 'Ce jeu existe déjà'
      });
    }

    const game = await Game.create({
      name,
      logo: logo || name.slice(0, 4).toUpperCase(),
      color: color || '#ff4655',
      mem: mem || '5 Players',
      posterImage: posterImage || '',
      bannerImage: bannerImage || '',
      description: description || '',
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Jeu créé avec succès 🐺🎮',
      game
    });
  } catch (error) {
    console.error('Erreur createGame :', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du jeu',
      error: error.message
    });
  }
};

// @desc    Modifier un jeu existant
// @route   PUT /api/games/:id
// @access  Private/Admin
const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Jeu mis à jour avec succès',
      game: updatedGame
    });
  } catch (error) {
    console.error('Erreur updateGame :', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du jeu',
      error: error.message
    });
  }
};

// @desc    Supprimer un jeu
// @route   DELETE /api/games/:id
// @access  Private/Admin
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }

    await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Jeu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur deleteGame :', error.message);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du jeu',
      error: error.message
    });
  }
};

module.exports = {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};
