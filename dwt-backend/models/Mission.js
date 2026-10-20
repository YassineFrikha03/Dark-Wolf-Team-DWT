const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Le code unique de la mission est obligatoire'],
      unique: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Le titre de la mission est obligatoire'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La description de la mission est obligatoire'],
      trim: true
    },
    points: {
      type: Number,
      required: true,
      default: 30
    },
    xp: {
      type: Number,
      required: true,
      default: 30
    },
    icon: {
      type: String,
      default: 'Target' // Nom de l'icône Lucide
    },
    actionType: {
      type: String,
      enum: ['vote_mvp', 'predict_match', 'watch_video', 'community_challenge', 'visit_shop', 'custom'],
      default: 'custom'
    },
    actionUrl: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mission', missionSchema);
