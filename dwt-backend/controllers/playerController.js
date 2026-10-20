const Player = require('../models/Player');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

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

    // Synchroniser automatiquement avec un compte User pour la messagerie et l'espace joueur
    try {
      const cleanGamertag = player.gamertag.trim();
      let userAccount = await User.findOne({
        $or: [
          { gamertag: { $regex: new RegExp(`^${cleanGamertag}$`, 'i') } },
          ...(req.body.email ? [{ email: req.body.email.toLowerCase().trim() }] : [])
        ]
      });

      if (userAccount) {
        userAccount.role = 'player';
        if (player.game) userAccount.favoriteGame = player.game;
        if (player.avatar && (!userAccount.avatar || userAccount.avatar.includes('unsplash'))) {
          userAccount.avatar = player.avatar;
        }
        await userAccount.save();
      } else {
        const generatedEmail = (req.body.email || `${cleanGamertag.toLowerCase().replace(/[^a-z0-9]/g, '')}@darkwolfteam.com`).trim();
        const tempPassword = 'DWT2026!player';
        userAccount = await User.create({
          gamertag: cleanGamertag,
          email: generatedEmail,
          password: tempPassword,
          role: 'player',
          favoriteGame: player.game || 'Valorant',
          avatar: player.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
          bio: player.bio || `Joueur officiel de la meute Dark Wolf Team sur ${player.game || 'Esport'}.`
        });
      }

      // Initialiser la conversation dans le système de messagerie chez l'admin
      let adminSenderId = req.user?._id;
      if (!adminSenderId) {
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) adminSenderId = adminUser._id;
      }

      if (adminSenderId && userAccount?._id) {
        const welcomeMessage = `🐺 Bienvenue dans la meute Dark Wolf Team, ${cleanGamertag} ! Tu as été ajouté au roster officiel ${player.game || ''} (${player.role || 'Joueur'}). Cet espace de messagerie privé te permet d'échanger en direct avec le staff. Prépare-toi pour les prochains entraînements et compétitions !`;

        await Message.create({
          sender: adminSenderId,
          receiver: userAccount._id,
          content: welcomeMessage
        });

        await Notification.create({
          recipient: userAccount._id,
          recipientRole: 'user',
          type: 'message',
          title: '🐺 Bienvenue dans le roster officiel DWT !',
          message: `Ton compte joueur sur ${player.game} est actif. Rejoins ton espace joueur et ta messagerie staff.`,
          metadata: { senderId: adminSenderId }
        }).catch(err => console.error('Erreur notification nouveau joueur :', err.message));
      }
    } catch (syncErr) {
      console.error('Erreur synchronisation compte utilisateur pour le joueur :', syncErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Joueur ajouté à la team et intégré à la messagerie avec succès ! 🐺',
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
