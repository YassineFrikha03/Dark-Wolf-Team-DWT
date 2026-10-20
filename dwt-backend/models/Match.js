const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    tournamentName: {
      type: String,
      required: [true, 'Le nom du tournoi ou de la compétition est obligatoire'],
      trim: true
    },
    game: {
      type: String,
      required: [true, 'Le jeu est obligatoire'],
      trim: true
    },
    opponent: {
      type: String,
      required: [true, "Le nom de l'équipe adverse est obligatoire"],
      trim: true
    },
    opponentLogo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=200&q=80'
    },
    matchDate: {
      type: Date,
      required: [true, 'La date et heure du match sont obligatoires']
    },
    format: {
      type: String,
      default: 'BO3' // BO1, BO3, BO5
    },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'finished'],
      default: 'upcoming'
    },
    scoreDWT: {
      type: Number,
      default: 0
    },
    scoreOpponent: {
      type: Number,
      default: 0
    },
    streamUrl: {
      type: String,
      default: 'https://www.twitch.tv/darkw0lfteam'
    },
    vodUrl: {
      type: String,
      default: ''
    },
    mvp: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);