const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre du palmarès/succès est obligatoire'],
      trim: true
    },
    tournament: {
      type: String,
      required: true
    },
    game: {
      type: String,
      required: true
    },
    placement: {
      type: String,
      required: true // ex: '1ère Place 🏆', 'Finaliste 🥈', 'Top 4 🥉'
    },
    date: {
      type: Date,
      default: Date.now
    },
    prizePool: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '🏆'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
