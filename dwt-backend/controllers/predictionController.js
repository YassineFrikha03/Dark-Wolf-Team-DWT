const Prediction = require('../models/Prediction');
const Match = require('../models/Match');
const User = require('../models/User');
const Mission = require('../models/Mission');
const { getISOWeekKey } = require('../utils/wolfRank');

// @desc    Créer ou mettre à jour un pronostic pour un match
// @route   POST /api/predictions
// @access  Privé
const createPrediction = async (req, res, next) => {
  try {
    const { matchId, predictedWinner, predictedScore, predictedMVP } = req.body;

    if (!matchId || !predictedWinner || !predictedScore) {
      return res.status(400).json({
        success: false,
        message: 'Données de pronostic incomplètes (match, vainqueur et score requis)'
      });
    }

    // Vérifier que le match existe et est toujours 'upcoming'
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match introuvable'
      });
    }

    if (match.status !== 'upcoming') {
      return res.status(400).json({
        success: false,
        message: 'Les pronostics sont fermés pour ce match (déjà en direct ou terminé)'
      });
    }

    // Vérifier si un pronostic existe déjà
    let prediction = await Prediction.findOne({ user: req.user._id, match: matchId });
    let isNew = false;

    if (prediction) {
      // Mise à jour du pronostic
      prediction.predictedWinner = predictedWinner;
      prediction.predictedScore = {
        scoreDWT: Number(predictedScore.scoreDWT || 0),
        scoreOpponent: Number(predictedScore.scoreOpponent || 0)
      };
      if (predictedMVP !== undefined) prediction.predictedMVP = predictedMVP;
      await prediction.save();
    } else {
      isNew = true;
      prediction = await Prediction.create({
        user: req.user._id,
        match: matchId,
        predictedWinner,
        predictedScore: {
          scoreDWT: Number(predictedScore.scoreDWT || 0),
          scoreOpponent: Number(predictedScore.scoreOpponent || 0)
        },
        predictedMVP: predictedMVP || ''
      });

      // Mettre à jour les stats de l'utilisateur
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'predictionStats.total': 1 }
      });
    }

    // Valider automatiquement la mission hebdomadaire "predict_match"
    const currentWeekKey = getISOWeekKey();
    const user = await User.findById(req.user._id);
    let missionCompletedNow = false;

    if (user && !user.weeklyMissionsCompleted.some((m) => m.code === 'predict_match' && m.weekKey === currentWeekKey)) {
      user.weeklyMissionsCompleted.push({
        code: 'predict_match',
        weekKey: currentWeekKey,
        completedAt: new Date()
      });

      // Récupérer les points de la mission
      const missionDoc = await Mission.findOne({ code: 'predict_match' });
      const pts = missionDoc ? missionDoc.points : 40;
      const xp = missionDoc ? missionDoc.xp : 40;

      await user.addWolfReward(pts, xp);
      missionCompletedNow = true;
    }

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew
        ? 'Pronostic enregistré avec succès ! Bonne chance 🐺🎯'
        : 'Pronostic mis à jour avec succès',
      prediction,
      missionCompletedNow
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les pronostics de l'utilisateur connecté
// @route   GET /api/predictions/my
// @access  Privé
const getMyPredictions = async (req, res, next) => {
  try {
    const predictions = await Prediction.find({ user: req.user._id })
      .populate('match', 'tournamentName game opponent opponentLogo matchDate format status scoreDWT scoreOpponent mvp')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      predictions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir les statistiques de pronostics d'un match (pourcentages de votes)
// @route   GET /api/predictions/match/:matchId
// @access  Public (authentification facultative via req.user)
const getMatchPredictions = async (req, res, next) => {
  try {
    const { matchId } = req.params;

    const [predictions, userPrediction] = await Promise.all([
      Prediction.find({ match: matchId }).select('predictedWinner predictedMVP'),
      req.user ? Prediction.findOne({ match: matchId, user: req.user._id }) : null
    ]);

    const total = predictions.length;
    const dwtCount = predictions.filter((p) => p.predictedWinner === 'DWT').length;
    const opponentCount = total - dwtCount;

    const dwtPercentage = total > 0 ? Math.round((dwtCount / total) * 100) : 50;
    const opponentPercentage = total > 0 ? 100 - dwtPercentage : 50;

    res.status(200).json({
      success: true,
      total,
      dwtCount,
      opponentCount,
      dwtPercentage,
      opponentPercentage,
      userPrediction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Résoudre les pronostics pour un match terminé
// @route   POST /api/predictions/resolve/:matchId
// @access  Privé (Admin/Staff)
const resolvePredictionsForMatch = async (matchId, customMatch = null) => {
  const match = customMatch || (await Match.findById(matchId));
  if (!match || match.status !== 'finished') {
    return { resolvedCount: 0, message: 'Le match doit être terminé avec score' };
  }

  const actualWinner =
    match.scoreDWT > match.scoreOpponent
      ? 'DWT'
      : match.scoreOpponent > match.scoreDWT
      ? match.opponent
      : 'DRAW';

  const predictions = await Prediction.find({ match: match._id, resolved: false });

  let resolvedCount = 0;

  for (const pred of predictions) {
    const winnerMatch = pred.predictedWinner === actualWinner;
    const scoreMatch =
      pred.predictedScore.scoreDWT === match.scoreDWT &&
      pred.predictedScore.scoreOpponent === match.scoreOpponent;
    const mvpMatch =
      Boolean(match.mvp) &&
      Boolean(pred.predictedMVP) &&
      pred.predictedMVP.trim().toLowerCase() === match.mvp.trim().toLowerCase();

    let pointsWon = 0;
    let xpWon = 0;

    if (winnerMatch) {
      pointsWon += 50;
      xpWon += 50;
    }
    if (scoreMatch) {
      pointsWon += 50;
      xpWon += 50;
    }
    if (mvpMatch) {
      pointsWon += 30;
      xpWon += 30;
    }

    let status = 'lost';
    if (winnerMatch && scoreMatch) {
      status = 'won';
    } else if (winnerMatch || scoreMatch || mvpMatch) {
      status = 'partial';
    }

    pred.status = status;
    pred.pointsEarned = pointsWon;
    pred.xpEarned = xpWon;
    pred.breakdown = { winnerMatch, scoreMatch, mvpMatch };
    pred.resolved = true;
    pred.resolvedAt = new Date();
    await pred.save();

    // Mettre à jour l'utilisateur
    const user = await User.findById(pred.user);
    if (user) {
      if (pointsWon > 0 || xpWon > 0) {
        user.predictionStats = user.predictionStats || {};
        user.predictionStats.won = (user.predictionStats.won || 0) + 1;
        user.predictionStats.pointsWon = (user.predictionStats.pointsWon || 0) + pointsWon;
        if (mvpMatch) {
          user.predictionStats.mvpGuesses = (user.predictionStats.mvpGuesses || 0) + 1;
        }

        // Attribution de badges de réussite
        if (!user.wolfBadges.some((b) => b.id === 'first_win')) {
          user.wolfBadges.push({
            id: 'first_win',
            title: 'Premier Sang (First Win)',
            description: 'A remporté son premier pronostic de match DWT.',
            icon: 'Flame',
            unlockedAt: new Date()
          });
        }

        if (user.predictionStats.won >= 5 && !user.wolfBadges.some((b) => b.id === 'oracle_wolf')) {
          user.wolfBadges.push({
            id: 'oracle_wolf',
            title: 'Oracle de la Meute',
            description: 'A prédit correctement au moins 5 matchs DWT.',
            icon: 'Trophy',
            unlockedAt: new Date()
          });
        }

        await user.addWolfReward(pointsWon, xpWon);
      }
    }

    resolvedCount++;
  }

  return { resolvedCount, totalPredictions: predictions.length };
};

// Handler HTTP pour déclencher la résolution
const resolvePredictionsHttp = async (req, res, next) => {
  try {
    const result = await resolvePredictionsForMatch(req.params.matchId);
    res.status(200).json({
      success: true,
      message: `Pronostics résolus avec succès (${result.resolvedCount} traités)`,
      result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir le classement de la saison (Season Leaderboard)
// @route   GET /api/predictions/leaderboard
// @access  Public
const getLeaderboard = async (req, res, next) => {
  try {
    const topUsers = await User.find({ isActive: true })
      .select('gamertag avatar wolfRank wolfPoints wolfXP avatarFrame predictionStats wolfBadges')
      .sort({ 'predictionStats.pointsWon': -1, wolfPoints: -1, wolfXP: -1 })
      .limit(50);

    const leaderboard = topUsers.map((u, index) => ({
      position: index + 1,
      id: u._id,
      gamertag: u.gamertag,
      avatar: u.avatar,
      wolfRank: u.wolfRank || 'Cub',
      avatarFrame: u.avatarFrame || 'default',
      wolfPoints: u.wolfPoints || 0,
      wolfXP: u.wolfXP || 0,
      pointsWon: u.predictionStats?.pointsWon || 0,
      predictionsWon: u.predictionStats?.won || 0,
      totalPredictions: u.predictionStats?.total || 0,
      badgesCount: u.wolfBadges?.length || 0
    }));

    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrediction,
  getMyPredictions,
  getMatchPredictions,
  resolvePredictionsForMatch,
  resolvePredictionsHttp,
  getLeaderboard
};
