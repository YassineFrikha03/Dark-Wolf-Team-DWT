const Mission = require('../models/Mission');
const User = require('../models/User');
const { getISOWeekKey } = require('../utils/wolfRank');

// Missions par défaut
const DEFAULT_MISSIONS = [
  {
    code: 'vote_mvp',
    title: 'Vote MVP du Match',
    description: 'Votez pour le joueur le plus décisif (MVP) de la dernière rencontre DWT.',
    points: 30,
    xp: 30,
    icon: 'Award',
    actionType: 'vote_mvp',
    actionUrl: '#news',
    order: 1
  },
  {
    code: 'predict_match',
    title: 'Pronostic de Match',
    description: 'Pronostiquez le score et le vainqueur du prochain match officiel de la meute.',
    points: 40,
    xp: 40,
    icon: 'Target',
    actionType: 'predict_match',
    actionUrl: '#predictions',
    order: 2
  },
  {
    code: 'watch_video',
    title: 'Visionner la Vidéo DWT',
    description: 'Regardez les derniers temps forts ou la vidéo officielle de la chaîne DWT.',
    points: 25,
    xp: 25,
    icon: 'Tv',
    actionType: 'watch_video',
    actionUrl: 'https://youtube.com',
    order: 3
  },
  {
    code: 'community_challenge',
    title: 'Défi Communautaire',
    description: 'Participez au challenge hebdomadaire des loups sur le Discord officiel.',
    points: 35,
    xp: 35,
    icon: 'Users',
    actionType: 'community_challenge',
    actionUrl: '#join',
    order: 4
  },
  {
    code: 'visit_shop',
    title: 'Explorer le Dark Lab',
    description: 'Visitez la collection officielle et découvrez les nouveaux maillots DWT.',
    points: 15,
    xp: 15,
    icon: 'ShoppingBag',
    actionType: 'visit_shop',
    actionUrl: '#shop',
    order: 5
  }
];

// Assurer la présence des missions par défaut
const ensureDefaultMissions = async () => {
  const count = await Mission.countDocuments();
  if (count === 0) {
    await Mission.insertMany(DEFAULT_MISSIONS);
  }
};

// @desc    Obtenir les missions hebdomadaires actives et la progression de l'utilisateur
// @route   GET /api/missions/weekly
// @access  Public (authentification facultative via req.user)
const getWeeklyMissions = async (req, res, next) => {
  try {
    await ensureDefaultMissions();

    const missions = await Mission.find({ isActive: true }).sort({ order: 1 });
    const currentWeekKey = getISOWeekKey();

    let completedCodes = [];
    let bonusClaimed = false;

    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        completedCodes = (user.weeklyMissionsCompleted || [])
          .filter((m) => m.weekKey === currentWeekKey)
          .map((m) => m.code);
        bonusClaimed = user.lastWeeklyBonusClaimed === currentWeekKey;
      }
    }

    const missionsWithStatus = missions.map((m) => {
      const isCompleted = completedCodes.includes(m.code);
      return {
        _id: m._id,
        code: m.code,
        title: m.title,
        description: m.description,
        points: m.points,
        xp: m.xp,
        icon: m.icon,
        actionType: m.actionType,
        actionUrl: m.actionUrl,
        isCompleted
      };
    });

    const totalMissions = missions.length;
    const completedCount = completedCodes.length;
    const progressPercent = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;
    const allCompleted = completedCount >= totalMissions && totalMissions > 0;
    const canClaimBonus = allCompleted && !bonusClaimed;

    res.status(200).json({
      success: true,
      weekKey: currentWeekKey,
      totalMissions,
      completedCount,
      progressPercent,
      allCompleted,
      canClaimBonus,
      bonusClaimed,
      weeklyBonusPoints: 100,
      weeklyBonusXP: 100,
      missions: missionsWithStatus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compléter manuellement une mission (ex: watch_video, visit_shop, community_challenge)
// @route   POST /api/missions/:code/complete
// @access  Privé
const completeMission = async (req, res, next) => {
  try {
    const { code } = req.params;
    const currentWeekKey = getISOWeekKey();

    const mission = await Mission.findOne({ code, isActive: true });
    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission introuvable ou inactive'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    // Vérifier si déjà complétée cette semaine
    const alreadyDone = (user.weeklyMissionsCompleted || []).some(
      (m) => m.code === code && m.weekKey === currentWeekKey
    );

    if (alreadyDone) {
      return res.status(400).json({
        success: false,
        message: 'Mission déjà validée pour cette semaine ! Reviens la semaine prochaine 🐺'
      });
    }

    // Ajouter aux missions complétées
    user.weeklyMissionsCompleted.push({
      code,
      weekKey: currentWeekKey,
      completedAt: new Date()
    });

    // Récompense
    const rewardResult = await user.addWolfReward(mission.points, mission.xp);

    res.status(200).json({
      success: true,
      message: `Mission validée ! +${mission.points} Points et +${mission.xp} XP remportés ! 🐺⚡`,
      reward: {
        pointsEarned: mission.points,
        xpEarned: mission.xp,
        newPoints: rewardResult.wolfPoints,
        newXP: rewardResult.wolfXP,
        leveledUp: rewardResult.leveledUp,
        newRank: rewardResult.newRank
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Réclamer le bonus de meute hebdomadaire (+100 XP/pts) quand toutes les quêtes sont finies
// @route   POST /api/missions/claim-bonus
// @access  Privé
const claimWeeklyBonus = async (req, res, next) => {
  try {
    const currentWeekKey = getISOWeekKey();
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    if (user.lastWeeklyBonusClaimed === currentWeekKey) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà récupéré le bonus hebdomadaire de la meute !'
      });
    }

    const activeMissions = await Mission.find({ isActive: true });
    const userWeekCompletedCodes = (user.weeklyMissionsCompleted || [])
      .filter((m) => m.weekKey === currentWeekKey)
      .map((m) => m.code);

    const allDone = activeMissions.every((m) => userWeekCompletedCodes.includes(m.code));

    if (!allDone) {
      return res.status(400).json({
        success: false,
        message: 'Vous devez compléter toutes les missions de la semaine pour réclamer ce bonus.'
      });
    }

    // Attribuer le super bonus hebdomadaire
    user.lastWeeklyBonusClaimed = currentWeekKey;

    // Ajouter le badge spécial Meute Parfaite si pas déjà débloqué
    if (!user.wolfBadges.some((b) => b.id === 'pack_master')) {
      user.wolfBadges.push({
        id: 'pack_master',
        title: 'Maître de Meute Hebdo',
        description: 'A complété toutes les missions de la semaine Dark Wolf.',
        icon: 'Crown',
        unlockedAt: new Date()
      });
    }

    const rewardResult = await user.addWolfReward(100, 100);

    res.status(200).json({
      success: true,
      message: 'Félicitations ! Bonus Alpha débloqué : +100 Points & +100 XP ajoutés à votre profil 🐺👑',
      reward: {
        pointsEarned: 100,
        xpEarned: 100,
        newPoints: rewardResult.wolfPoints,
        newXP: rewardResult.wolfXP,
        leveledUp: rewardResult.leveledUp,
        newRank: rewardResult.newRank
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeeklyMissions,
  completeMission,
  claimWeeklyBonus
};
