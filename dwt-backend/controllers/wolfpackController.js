const User = require('../models/User');
const Match = require('../models/Match');
const Mission = require('../models/Mission');
const { RANKS, FRAMES, calculateRank, getISOWeekKey } = require('../utils/wolfRank');

// @desc    Obtenir le profil Wolf Pack complet (Rangs, XP, Badges, Cadres débloqués)
// @route   GET /api/wolfpack/profile
// @access  Privé
const getWolfProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    const rankInfo = calculateRank(user.wolfXP || 0);

    // Déterminer les cadres autorisés pour ce rang
    const currentRankIndex = RANKS.findIndex((r) => r.name === rankInfo.currentRank);
    const availableFrames = FRAMES.map((f) => {
      const requiredRankIndex = RANKS.findIndex((r) => r.name === f.requiredRank);
      return {
        ...f,
        unlocked: currentRankIndex >= requiredRankIndex,
        isEquipped: (user.avatarFrame || 'default') === f.id
      };
    });

    res.status(200).json({
      success: true,
      profile: {
        userId: user._id,
        gamertag: user.gamertag,
        email: user.email,
        avatar: user.avatar,
        avatarFrame: user.avatarFrame || 'default',
        wolfPoints: user.wolfPoints || 0,
        wolfXP: user.wolfXP || 0,
        rank: rankInfo,
        allRanks: RANKS,
        badges: user.wolfBadges || [],
        availableFrames,
        predictionStats: user.predictionStats || {
          total: 0,
          won: 0,
          pointsWon: 0,
          mvpGuesses: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Équiper un cadre d'avatar débloqué
// @route   PUT /api/wolfpack/frame
// @access  Privé
const equipFrame = async (req, res, next) => {
  try {
    const { frameId } = req.body;
    const targetFrame = FRAMES.find((f) => f.id === frameId);

    if (!targetFrame) {
      return res.status(400).json({
        success: false,
        message: 'Cadre spécifié invalide'
      });
    }

    const user = await User.findById(req.user._id);
    const rankInfo = calculateRank(user.wolfXP || 0);
    const currentRankIndex = RANKS.findIndex((r) => r.name === rankInfo.currentRank);
    const requiredRankIndex = RANKS.findIndex((r) => r.name === targetFrame.requiredRank);

    if (currentRankIndex < requiredRankIndex) {
      return res.status(403).json({
        success: false,
        message: `Ce cadre nécessite le rang ${targetFrame.requiredRank} ou supérieur pour être équipé.`
      });
    }

    user.avatarFrame = frameId;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Cadre ${targetFrame.name} équipé avec succès ! 🐺✨`,
      avatarFrame: frameId
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Voter pour le MVP d'un match (valide automatiquement la mission vote_mvp)
// @route   POST /api/wolfpack/vote-mvp
// @access  Privé
const voteMVP = async (req, res, next) => {
  try {
    const { matchId, playerName } = req.body;

    if (!matchId || !playerName) {
      return res.status(400).json({
        success: false,
        message: 'Match et nom du joueur requis'
      });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match introuvable'
      });
    }

    const currentWeekKey = getISOWeekKey();
    const user = await User.findById(req.user._id);

    // Vérifier si la mission vote_mvp est déjà validée cette semaine
    const alreadyDone = (user.weeklyMissionsCompleted || []).some(
      (m) => m.code === 'vote_mvp' && m.weekKey === currentWeekKey
    );

    let reward = null;
    if (!alreadyDone) {
      user.weeklyMissionsCompleted.push({
        code: 'vote_mvp',
        weekKey: currentWeekKey,
        completedAt: new Date()
      });

      const missionDoc = await Mission.findOne({ code: 'vote_mvp' });
      const pts = missionDoc ? missionDoc.points : 30;
      const xp = missionDoc ? missionDoc.xp : 30;

      reward = await user.addWolfReward(pts, xp);
    } else {
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: `Vote enregistré pour ${playerName} ! 🐺🗳️`,
      missionCompleted: !alreadyDone,
      reward
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWolfProfile,
  equipFrame,
  voteMVP
};
