const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est obligatoire']
    },
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: [true, 'Le match est obligatoire']
    },
    predictedWinner: {
      type: String,
      required: [true, 'Le gagnant pronostiqué est obligatoire'],
      trim: true
    },
    predictedScore: {
      scoreDWT: {
        type: Number,
        required: [true, 'Le score DWT pronostiqué est obligatoire'],
        min: 0,
        max: 10
      },
      scoreOpponent: {
        type: Number,
        required: [true, 'Le score adverse pronostiqué est obligatoire'],
        min: 0,
        max: 10
      }
    },
    predictedMVP: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'won', 'lost', 'partial'],
      default: 'pending'
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    xpEarned: {
      type: Number,
      default: 0
    },
    breakdown: {
      winnerMatch: { type: Boolean, default: false },
      scoreMatch: { type: Boolean, default: false },
      mvpMatch: { type: Boolean, default: false }
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

// Un seul pronostic par utilisateur par match
predictionSchema.index({ user: 1, match: 1 }, { unique: true });

module.exports = mongoose.model('Prediction', predictionSchema);
