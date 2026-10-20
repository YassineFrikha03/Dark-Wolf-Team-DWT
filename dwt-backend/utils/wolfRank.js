/**
 * Wolf Pack Gamification System Utilities
 * Dark Wolf Team (DWT)
 */

// Rank thresholds based on Lifetime XP
const RANKS = [
  {
    name: 'Cub',
    arName: 'شبل',
    frName: 'Louveteau',
    minXp: 0,
    maxXp: 299,
    color: '#94a3b8',
    frame: 'default',
    badgeId: 'rank_cub',
    badgeTitle: 'Louveteau de la Meute',
    badgeDesc: 'A rejoint la Dark Wolf Team en tant que jeune loup.'
  },
  {
    name: 'Scout',
    arName: 'كشّاف',
    frName: 'Éclaireur',
    minXp: 300,
    maxXp: 799,
    color: '#38bdf8',
    frame: 'scout_silver',
    badgeId: 'rank_scout',
    badgeTitle: 'Éclaireur Féroce',
    badgeDesc: 'A fait ses preuves et guide la meute vers la victoire.'
  },
  {
    name: 'Hunter',
    arName: 'صياد',
    frName: 'Chasseur',
    minXp: 800,
    maxXp: 1799,
    color: '#f59e0b',
    frame: 'hunter_gold',
    badgeId: 'rank_hunter',
    badgeTitle: 'Chasseur d\'Élite',
    badgeDesc: 'Un loup redoutable qui traque sans relâche les succès esports.'
  },
  {
    name: 'Alpha',
    arName: 'ألفا',
    frName: 'Loup Alpha',
    minXp: 1800,
    maxXp: Infinity,
    color: '#e60000',
    frame: 'alpha_fire',
    badgeId: 'rank_alpha',
    badgeTitle: 'Alpha Suprême',
    badgeDesc: 'Le sommet de la hiérarchie Dark Wolf. Meneur légendaire de la meute.'
  }
];

// Available Frames
const FRAMES = [
  { id: 'default', name: 'Cadre Standard', requiredRank: 'Cub' },
  { id: 'cub_bronze', name: 'Cadre Louveteau Bronze', requiredRank: 'Cub' },
  { id: 'scout_silver', name: 'Cadre Éclaireur Argent', requiredRank: 'Scout' },
  { id: 'hunter_gold', name: 'Cadre Chasseur Or', requiredRank: 'Hunter' },
  { id: 'alpha_fire', name: 'Aura Alpha Ardent', requiredRank: 'Alpha' }
];

// Helper to get current ISO week key (e.g., "2026-W42")
const getISOWeekKey = (date = new Date()) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo < 10 ? '0' : ''}${weekNo}`;
};

// Calculate rank details from XP
const calculateRank = (xp = 0) => {
  const rank = RANKS.slice().reverse().find((r) => xp >= r.minXp) || RANKS[0];
  const nextRank = RANKS.find((r) => r.minXp > xp) || null;

  let progressPercent = 100;
  let xpForNext = 0;

  if (nextRank) {
    const range = nextRank.minXp - rank.minXp;
    const current = xp - rank.minXp;
    progressPercent = Math.min(100, Math.max(0, Math.round((current / range) * 100)));
    xpForNext = nextRank.minXp - xp;
  }

  return {
    currentRank: rank.name,
    arName: rank.arName,
    frName: rank.frName,
    color: rank.color,
    frame: rank.frame,
    progressPercent,
    xpForNext,
    nextRank: nextRank ? nextRank.name : null,
    minXp: rank.minXp,
    maxXp: rank.maxXp
  };
};

module.exports = {
  RANKS,
  FRAMES,
  getISOWeekKey,
  calculateRank
};
