const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    gamertag: {
      type: String,
      required: [true, 'Le pseudo (Gamertag) est obligatoire'],
      unique: true,
      trim: true
    },
    realName: {
      type: String,
      trim: true,
      default: ''
    },
    nationality: {
      type: String,
      default: 'FR'
    },
    game: {
      type: String,
      required: [true, 'Le jeu principal est obligatoire'] // Valorant, LoL, CS2, Rocket League, etc.
    },
    role: {
      type: String,
      required: [true, 'Le rôle est obligatoire'] // ex: Capitaine, Sniper, IGL, Duelist, Coach...
    },
    rank: {
      type: String,
      default: 'Non classé'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80'
    },
    bio: {
      type: String,
      default: 'Joueur compétitif de la Dark Wolf Team.'
    },
    stats: {
      winRate: { type: String, default: '65%' },
      kda: { type: String, default: '1.45' },
      matchesPlayed: { type: Number, default: 0 }
    },
    socialLinks: {
      twitch: { type: String, default: '' },
      youtube: { type: String, default: '' },
      discord: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    isStarter: {
      type: Boolean,
      default: true // true = Titulaire, false = Remplaçant
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);