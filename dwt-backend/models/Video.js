const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la vidéo est obligatoire'],
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['trailer', 'product_ad', 'announcement', 'match_highlight'],
      default: 'trailer'
    },
    videoUrl: {
      type: String,
      required: [true, "L'URL de la vidéo (YouTube ou fichier vidéo) est obligatoire"],
      trim: true
    },
    thumbnail: {
      type: String,
      default: '/backgrounds/hero-gaming-bg.jpg',
      trim: true
    },
    duration: {
      type: String,
      default: '02:30',
      trim: true
    },
    views: {
      type: String,
      default: '120K vues',
      trim: true
    },
    badge: {
      type: String,
      default: 'TRAILER',
      trim: true
    },
    isMainTrailer: {
      type: Boolean,
      default: false
    },
    ctaText: {
      type: String,
      default: 'Découvrir',
      trim: true
    },
    ctaLink: {
      type: String,
      default: '#shop',
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
