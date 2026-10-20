const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du jeu est obligatoire'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    logo: {
      type: String,
      default: '',
      trim: true
    },
    color: {
      type: String,
      default: '#ff4655',
      trim: true
    },
    mem: {
      type: String,
      default: '5 Players',
      trim: true
    },
    posterImage: {
      type: String,
      default: '',
      trim: true
    },
    bannerImage: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
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
  {
    timestamps: true
  }
);

// Auto-générer le slug avant validation
gameSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

module.exports = mongoose.model('Game', gameSchema);
