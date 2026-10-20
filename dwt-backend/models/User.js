const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    gamertag: {
      type: String,
      required: [true, 'Le gamertag (pseudo) est obligatoire'],
      unique: true,
      trim: true,
      minlength: [3, 'Le gamertag doit contenir au moins 3 caractères'],
      maxlength: [30, 'Le gamertag ne peut pas dépasser 30 caractères']
    },
    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'player', 'moderator', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=300&q=80'
    },
    bio: {
      type: String,
      default: 'Membre officiel de la Dark Wolf Team.'
    },
    discordTag: {
      type: String,
      default: ''
    },
    favoriteGame: {
      type: String,
      default: 'Valorant'
    },
    socialLinks: {
      twitch: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
      discord: { type: String, default: '' }
    },
    resetPasswordCode: {
      type: String,
      default: undefined
    },
    resetPasswordCodeExpires: {
      type: Date,
      default: undefined
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Système Wolf Pack Gamification
    wolfPoints: {
      type: Number,
      default: 150 // Points de bienvenue pour les nouveaux fans
    },
    wolfXP: {
      type: Number,
      default: 150 // XP de départ
    },
    wolfRank: {
      type: String,
      enum: ['Cub', 'Scout', 'Hunter', 'Alpha'],
      default: 'Cub'
    },
    avatarFrame: {
      type: String,
      default: 'default'
    },
    wolfBadges: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Shield' },
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    predictionStats: {
      total: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      pointsWon: { type: Number, default: 0 },
      mvpGuesses: { type: Number, default: 0 }
    },
    weeklyMissionsCompleted: [
      {
        code: { type: String, required: true },
        weekKey: { type: String, required: true },
        completedAt: { type: Date, default: Date.now }
      }
    ],
    lastWeeklyBonusClaimed: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour ajouter des points et de l'XP avec montée en rang automatique
userSchema.methods.addWolfReward = async function (points = 0, xp = 0) {
  const { calculateRank, RANKS } = require('../utils/wolfRank');
  const oldRank = this.wolfRank || 'Cub';

  this.wolfPoints = (this.wolfPoints || 0) + points;
  this.wolfXP = (this.wolfXP || 0) + xp;

  const rankInfo = calculateRank(this.wolfXP);
  const newRank = rankInfo.currentRank;
  let leveledUp = false;

  if (oldRank !== newRank) {
    this.wolfRank = newRank;
    leveledUp = true;
    // Vérifier si le badge de ce nouveau rang est déjà présent
    const rankConfig = RANKS.find((r) => r.name === newRank);
    if (rankConfig && !this.wolfBadges.some((b) => b.id === rankConfig.badgeId)) {
      this.wolfBadges.push({
        id: rankConfig.badgeId,
        title: rankConfig.badgeTitle,
        description: rankConfig.badgeDesc,
        icon: 'Award',
        unlockedAt: new Date()
      });
    }
    // Assigner automatiquement le cadre correspondant si l'utilisateur a toujours le cadre par défaut
    if (this.avatarFrame === 'default') {
      this.avatarFrame = rankConfig.frame;
    }
  }

  await this.save();
  return { leveledUp, oldRank, newRank, wolfPoints: this.wolfPoints, wolfXP: this.wolfXP };
};

module.exports = mongoose.model('User', userSchema);
