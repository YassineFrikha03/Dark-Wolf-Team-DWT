const Player = require('../models/Player');
const Match = require('../models/Match');
const Application = require('../models/Application');
const News = require('../models/News');
const Achievement = require('../models/Achievement');
const User = require('../models/User');

// @desc    Obtenir les statistiques globales de la team pour la vitrine esport
// @route   GET /api/stats/overview
// @access  Public
const getTeamOverviewStats = async (req, res, next) => {
  try {
    const [
      totalPlayers,
      distinctGames,
      finishedMatches,
      upcomingMatchesCount,
      liveMatchesCount,
      achievementsCount,
      newsCount,
      communityMembersCount
    ] = await Promise.all([
      Player.countDocuments({ isActive: true }),
      Player.distinct('game'),
      Match.find({ status: 'finished' }),
      Match.countDocuments({ status: 'upcoming' }),
      Match.countDocuments({ status: 'live' }),
      Achievement.countDocuments(),
      News.countDocuments({ isPublished: true }),
      User.countDocuments({ isActive: true })
    ]);

    // Calcul victoires / défaites
    let wins = 0;
    let losses = 0;
    let draws = 0;

    finishedMatches.forEach((m) => {
      if (m.scoreDWT > m.scoreOpponent) wins++;
      else if (m.scoreDWT < m.scoreOpponent) losses++;
      else draws++;
    });

    const totalMatchesPlayed = finishedMatches.length;
    const winRate = totalMatchesPlayed > 0 ? Math.round((wins / totalMatchesPlayed) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalPlayers,
        gamesCount: distinctGames.length,
        games: distinctGames,
        totalMatchesPlayed,
        wins,
        losses,
        draws,
        winRate: `${winRate}%`,
        upcomingMatchesCount,
        liveMatchesCount,
        achievementsCount,
        newsCount,
        communityMembersCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Statistiques d'administration (Dashboard Admin)
// @route   GET /api/stats/admin-dashboard
// @access  Privé (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      pendingApplications,
      totalPlayers,
      totalMatches,
      recentNews
    ] = await Promise.all([
      User.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Player.countDocuments(),
      Match.countDocuments(),
      News.find().sort({ createdAt: -1 }).limit(5).select('title views likes createdAt')
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        pendingApplications,
        totalPlayers,
        totalMatches,
        recentNews
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTeamOverviewStats,
  getAdminDashboardStats
};
