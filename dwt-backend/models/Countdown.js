const mongoose = require('mongoose');

const countdownSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre de l'événement est obligatoire"],
      trim: true,
      default: 'DWT Summer Championship 2026'
    },
    subtitle: {
      type: String,
      trim: true,
      default: '— Next Major Event —'
    },
    targetDate: {
      type: Date,
      required: [true, 'La date cible du compte à rebours est obligatoire'],
      default: () => new Date('2026-08-15T18:00:00')
    },
    description: {
      type: String,
      trim: true,
      default: 'Le plus grand tournoi esport de la saison organisé par Dark Wolf Team. Venez soutenir la meute !'
    },
    badge: {
      type: String,
      trim: true,
      default: 'ÉVÉNEMENT MAJEUR'
    },
    game: {
      type: String,
      trim: true,
      default: 'Valorant'
    },
    buttonText: {
      type: String,
      trim: true,
      default: 'Voir le Tournoi'
    },
    buttonLink: {
      type: String,
      trim: true,
      default: '#tournois'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Countdown', countdownSchema);
