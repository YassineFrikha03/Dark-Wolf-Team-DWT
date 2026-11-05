const mongoose = require('mongoose');

const customGearSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: [true, "Le nom de l'équipement est requis"],
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    basePrice: {
      type: Number,
      required: [true, 'Le prix de base est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
      default: 69.99
    },
    currency: {
      type: String,
      default: 'TND'
    },
    order: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: 'shirt'
    },
    models: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        accentPattern: { type: String, default: 'apex' }
      }
    ],
    colors: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        hex: { type: String, required: true },
        secondaryHex: { type: String, default: '#ffffff' }
      }
    ],
    positions: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true }
      }
    ],
    styles: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        extraPrice: { type: Number, default: 0 }
      }
    ],
    customTextPrice: {
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

module.exports = mongoose.model('CustomGear', customGearSchema);
